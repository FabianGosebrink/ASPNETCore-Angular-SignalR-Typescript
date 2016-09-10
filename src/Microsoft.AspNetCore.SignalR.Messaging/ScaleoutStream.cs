// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.Logging;

namespace Microsoft.AspNetCore.SignalR.Messaging
{
    internal class ScaleoutStream
    {
        private TaskCompletionSource<object> _taskCompletionSource;
        private static Task _initializeDrainTask;
        private TaskQueue _queue;
        private StreamState _state;
        private Exception _error;

        private readonly int _size;
        private readonly QueuingBehavior _queueBehavior;
        private readonly ILogger _logger;

        private readonly string _loggerPrefix;
        private readonly IPerformanceCounterManager _perfCounters;

        private readonly object _lockObj = new object();

        public ScaleoutStream(ILogger logger, string loggerPrefix, QueuingBehavior queueBehavior, int size, IPerformanceCounterManager performanceCounters)
        {
            if (logger == null)
            {
                throw new ArgumentNullException("logger");
            }

            _logger = logger;
            _loggerPrefix = loggerPrefix;
            _size = size;
            _perfCounters = performanceCounters;

            _queueBehavior = queueBehavior;

            InitializeCore();
        }

        private bool UsingTaskQueue
        {
            get
            {
                // Either you're always queuing or you're only queuing initially and you're in the initial state
                return _queueBehavior == QueuingBehavior.Always ||
                       (_queueBehavior == QueuingBehavior.InitialOnly && _state == StreamState.Initial);
            }
        }

        public void Open()
        {
            lock (_lockObj)
            {
                bool usingTaskQueue = UsingTaskQueue;

                StreamState previousState;
                if (ChangeState(StreamState.Open, out previousState))
                {
                    _perfCounters.ScaleoutStreamCountOpen.Increment();
                    _perfCounters.ScaleoutStreamCountBuffering.Decrement();

                    _error = null;

                    if (usingTaskQueue)
                    {
                        EnsureQueueStarted();

                        if (previousState == StreamState.Initial && _queueBehavior == QueuingBehavior.InitialOnly)
                        {
                            _initializeDrainTask = Drain(_queue, _logger);
                        }
                    }
                }
            }
        }

        public Task Send(Func<object, Task> send, object state)
        {
            lock (_lockObj)
            {
                if (_error != null)
                {
                    throw _error;
                }

                // If the queue is closed then stop sending
                if (_state == StreamState.Closed)
                {
                    throw new InvalidOperationException(Resources.Error_StreamClosed);
                }

                var context = new SendContext(this, send, state);

                if (_initializeDrainTask != null && !_initializeDrainTask.IsCompleted)
                {
                    // Wait on the draining of the queue before proceeding with the send
                    // NOTE: Calling .Wait() here is safe because the task wasn't created on an ASP.NET request thread
                    //       and thus has no captured sync context
                    _initializeDrainTask.Wait();
                }

                if (UsingTaskQueue)
                {
                    Task task = _queue.Enqueue(Send, context);

                    if (task == null)
                    {
                        // The task is null if the queue is full
                        throw new InvalidOperationException(Resources.Error_TaskQueueFull);
                    }

                    // Always observe the task in case the user doesn't handle it
                    return task.Catch(_logger);
                }

                return Send(context);
            }
        }

        public void SetError(Exception error)
        {
            Log(LogLevel.Error, "Error has happened with the following exception: {0}.", error);

            lock (_lockObj)
            {
                _perfCounters.ScaleoutErrorsTotal.Increment();
                _perfCounters.ScaleoutErrorsPerSec.Increment();

                Buffer();

                _error = error;
            }
        }

        public void Close()
        {
            Task task = TaskAsyncHelper.Empty;

            lock (_lockObj)
            {
                if (ChangeState(StreamState.Closed))
                {
                    _perfCounters.ScaleoutStreamCountOpen.RawValue = 0;
                    _perfCounters.ScaleoutStreamCountBuffering.RawValue = 0;

                    if (UsingTaskQueue)
                    {
                        // Ensure the queue is started
                        EnsureQueueStarted();

                        // Drain the queue to stop all sends
                        task = Drain(_queue, _logger);
                    }
                }
            }

            if (UsingTaskQueue)
            {
                // Block until the queue is drained so no new work can be done
                task.Wait();
            }
        }

        private static Task Send(object state)
        {
            var context = (SendContext)state;

            context.InvokeSend().Then(tcs =>
            {
                // Complete the task if the send is successful
                tcs.TrySetResult(null);
            },
            context.TaskCompletionSource)
            .Catch((ex, obj) =>
            {
                var ctx = (SendContext)obj;

                ctx.Stream.Log(LogLevel.Error, "Send failed: {0}", ex);

                lock (ctx.Stream._lockObj)
                {
                    // Set the queue into buffering state
                    ctx.Stream.SetError(ex.InnerException);

                    // Otherwise just set this task as failed
                    ctx.TaskCompletionSource.TrySetUnwrappedException(ex);
                }
            },
            context,
            context.Stream._logger);

            return context.TaskCompletionSource.Task;
        }

        private void Buffer()
        {
            lock (_lockObj)
            {
                if (ChangeState(StreamState.Buffering))
                {
                    _perfCounters.ScaleoutStreamCountOpen.Decrement();
                    _perfCounters.ScaleoutStreamCountBuffering.Increment();

                    InitializeCore();
                }
            }
        }

        private void InitializeCore()
        {
            if (UsingTaskQueue)
            {
                Task task = DrainPreviousQueue();
                _queue = new TaskQueue(task, _size);
                _queue.QueueSizeCounter = _perfCounters.ScaleoutSendQueueLength;
            }
        }

        private Task DrainPreviousQueue()
        {
            // If the tcs is null or complete then create a new one
            if (_taskCompletionSource == null ||
                _taskCompletionSource.Task.IsCompleted)
            {
                _taskCompletionSource = new TaskCompletionSource<object>();
            }

            if (_queue != null)
            {
                // Drain the queue when the new queue is open
                return _taskCompletionSource.Task.Then((q, t) => Drain(q, t), _queue, _logger);
            }

            // Nothing to drain
            return _taskCompletionSource.Task;
        }

        private void EnsureQueueStarted()
        {
            if (_taskCompletionSource != null)
            {
                _taskCompletionSource.TrySetResult(null);
            }
        }

        private bool ChangeState(StreamState newState)
        {
            StreamState oldState;
            return ChangeState(newState, out oldState);
        }

        private bool ChangeState(StreamState newState, out StreamState previousState)
        {
            previousState = _state;

            // Do nothing if the state is closed
            if (_state == StreamState.Closed)
            {
                return false;
            }

            if (_state != newState)
            {
                Log(LogLevel.Information, "Changed state from {0} to {1}", _state, newState);
                _state = newState;
                return true;
            }

            return false;
        }

        private static Task Drain(TaskQueue queue, ILogger logger)
        {
            if (queue == null)
            {
                return TaskAsyncHelper.Empty;
            }

            var tcs = new TaskCompletionSource<object>();
            
            queue.Drain().Catch(logger).ContinueWith(task =>
            {
                tcs.SetResult(null);
            });

            return tcs.Task;
        }

        private void Log(LogLevel logLevel, string value, params object[] args)
        {
            switch (logLevel)
            {
                case LogLevel.Critical:
                    _logger.LogCritical(String.Format(value, args));
                    break;
                case LogLevel.Error:
                    _logger.LogError(String.Format(value, args));
                    break;
                case LogLevel.Warning:
                    _logger.LogWarning(String.Format(value, args));
                    break;
                case LogLevel.Information:
                    _logger.LogInformation(String.Format(value, args));
                    break;
                case LogLevel.Debug:
                    _logger.LogDebug(String.Format(value, args));
                    break;
                case LogLevel.Trace:
                    _logger.LogTrace(String.Format(value, args));
                    break;
                default:
                    break;
            }
        }

        private class SendContext
        {
            private readonly Func<object, Task> _send;
            private readonly object _state;

            public readonly ScaleoutStream Stream;
            public readonly TaskCompletionSource<object> TaskCompletionSource;

            public SendContext(ScaleoutStream stream, Func<object, Task> send, object state)
            {
                Stream = stream;
                TaskCompletionSource = new TaskCompletionSource<object>();
                _send = send;
                _state = state;
            }

            [SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "The exception flows to the caller")]
            public Task InvokeSend()
            {
                try
                {
                    return _send(_state);
                }
                catch (Exception ex)
                {
                    return TaskAsyncHelper.FromError(ex);
                }
            }
        }

        private enum StreamState
        {
            Initial,
            Open,
            Buffering,
            Closed
        }
    }
}
