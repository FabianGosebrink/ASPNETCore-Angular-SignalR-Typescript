// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.Logging;


namespace Microsoft.AspNetCore.SignalR.Transports
{
    [SuppressMessage("Microsoft.Design", "CA1001:TypesThatOwnDisposableFieldsShouldBeDisposable", Justification = "Disposable fields are disposed from a different method")]
    public abstract class TransportDisconnectBase : ITrackingConnection
    {
        private readonly HttpContext _context;
        private readonly ITransportHeartbeat _heartbeat;

        private ILogger _logger;

        private int _timedOut;
        private readonly IPerformanceCounterManager _counters;
        private int _ended;
        private TransportConnectionStates _state;

        [SuppressMessage("Microsoft.Design", "CA1051:DoNotDeclareVisibleInstanceFields", Justification = "It can be set in any derived class.")]
        protected string _lastMessageId;

        internal static readonly Func<Task> _emptyTaskFunc = () => TaskAsyncHelper.Empty;

        // The TCS that completes when the task returned by PersistentConnection.OnConnected does.
        internal TaskCompletionSource<object> _connectTcs;

        // Token that represents the end of the connection based on a combination of
        // conditions (timeout, disconnect, connection forcibly ended, host shutdown)
        private CancellationToken _connectionEndToken;
        private SafeCancellationTokenSource _connectionEndTokenSource;
        private Task _lastWriteTask = TaskAsyncHelper.Empty;

        // Token that represents the host shutting down
        private readonly CancellationToken _hostShutdownToken;
        private IDisposable _hostRegistration;
        private IDisposable _connectionEndRegistration;

        // Token that represents the client disconnecting
        private readonly CancellationToken _requestAborted;

        internal HttpRequestLifeTime _requestLifeTime;

        protected TransportDisconnectBase(HttpContext context, ITransportHeartbeat heartbeat, IPerformanceCounterManager performanceCounterManager, IApplicationLifetime applicationLifetime, ILoggerFactory loggerFactory, IMemoryPool pool)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (heartbeat == null)
            {
                throw new ArgumentNullException("heartbeat");
            }

            if (performanceCounterManager == null)
            {
                throw new ArgumentNullException("performanceCounterManager");
            }

            if (applicationLifetime == null)
            {
                throw new ArgumentNullException("applicationLifetime");
            }

            if (loggerFactory == null)
            {
                throw new ArgumentNullException("loggerFactory");
            }

            Pool = pool;

            _context = context;
            _heartbeat = heartbeat;
            _counters = performanceCounterManager;
            _hostShutdownToken = applicationLifetime.ApplicationStopping;
            _requestAborted = context.RequestAborted;

            // Queue to protect against overlapping writes to the underlying response stream
            WriteQueue = new TaskQueue();
            _logger = loggerFactory.CreateLogger(GetType().FullName);
        }

        protected IMemoryPool Pool { get; private set; }

        protected ILogger Logger
        {
            get
            {
                return _logger;
            }
        }

        public string ConnectionId
        {
            get;
            set;
        }

        protected string LastMessageId
        {
            get
            {
                return _lastMessageId;
            }
        }

        protected virtual Task InitializeMessageId()
        {
            _lastMessageId = Context.Request.Query["messageId"];
            return TaskAsyncHelper.Empty;
        }

        [SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "This is for async.")]
        public virtual Task<string> GetGroupsToken()
        {
            return TaskAsyncHelper.FromResult(Context.Request.Query["groupsToken"].ToString());
        }

        internal TaskQueue WriteQueue
        {
            get;
            set;
        }

        public Func<bool, Task> Disconnected { get; set; }

        // Token that represents the client disconnecting
        public virtual CancellationToken CancellationToken
        {
            get
            {
                return _requestAborted;
            }
        }

        public virtual bool IsAlive
        {
            get
            {
                // If the CTS is tripped or the request has ended then the connection isn't alive
                return !(
                    CancellationToken.IsCancellationRequested ||
                    (_requestLifeTime != null && _requestLifeTime.Task.IsCompleted) ||
                    _lastWriteTask.IsCanceled ||
                    _lastWriteTask.IsFaulted
                );
            }
        }

        public Task ConnectTask
        {
            get
            {
                return _connectTcs.Task;
            }
        }

        protected CancellationToken ConnectionEndToken
        {
            get
            {
                return _connectionEndToken;
            }
        }

        protected CancellationToken HostShutdownToken
        {
            get
            {
                return _hostShutdownToken;
            }
        }

        public bool IsTimedOut
        {
            get
            {
                return _timedOut == 1;
            }
        }

        public virtual bool SupportsKeepAlive
        {
            get
            {
                return true;
            }
        }

        public virtual bool RequiresTimeout
        {
            get
            {
                return false;
            }
        }

        public virtual TimeSpan DisconnectThreshold
        {
            get { return TimeSpan.FromSeconds(5); }
        }

        protected bool IsConnectRequest
        {
            get
            {
                return Context.Request.LocalPath().EndsWith("/connect", StringComparison.OrdinalIgnoreCase);
            }
        }

        protected bool IsSendRequest
        {
            get
            {
                return Context.Request.LocalPath().EndsWith("/send", StringComparison.OrdinalIgnoreCase);
            }
        }

        protected bool IsAbortRequest
        {
            get
            {
                return Context.Request.LocalPath().EndsWith("/abort", StringComparison.OrdinalIgnoreCase);
            }
        }

        protected virtual bool SuppressReconnect
        {
            get
            {
                return false;
            }
        }

        protected ITransportConnection Connection { get; set; }

        protected HttpContext Context
        {
            get { return _context; }
        }

        protected ITransportHeartbeat Heartbeat
        {
            get { return _heartbeat; }
        }

        protected void IncrementErrors()
        {
            _counters.ErrorsTransportTotal.Increment();
            _counters.ErrorsTransportPerSec.Increment();
            _counters.ErrorsAllTotal.Increment();
            _counters.ErrorsAllPerSec.Increment();
        }

        public abstract void IncrementConnectionsCount();

        public abstract void DecrementConnectionsCount();

        public Task Disconnect()
        {
            return Abort(clean: false);
        }

        protected Task Abort()
        {
            return Abort(clean: true);
        }

        private Task Abort(bool clean)
        {
            if (clean)
            {
                ApplyState(TransportConnectionStates.Aborted);
            }
            else
            {
                ApplyState(TransportConnectionStates.Disconnected);
            }

            Logger.LogInformation("Abort(" + ConnectionId + ")");

            // When a connection is aborted (graceful disconnect) we send a command to it
            // telling to to disconnect. At that moment, we raise the disconnect event and
            // remove this connection from the heartbeat so we don't end up raising it for the same connection.
            Heartbeat.RemoveConnection(this);

            // End the connection
            End();

            var disconnectTask = Disconnected != null ? Disconnected(clean) : TaskAsyncHelper.Empty;

            // Ensure delegate continues to use the C# Compiler static delegate caching optimization.
            return disconnectTask
                .Catch((ex, state) => OnDisconnectError(ex, state), state: Logger, logger: Logger)
                .Finally(state =>
                {
                    var counters = (IPerformanceCounterManager)state;
                    counters.ConnectionsDisconnected.Increment();
                }, _counters);
        }

        public void ApplyState(TransportConnectionStates states)
        {
            _state |= states;
        }

        public void Timeout()
        {
            if (Interlocked.Exchange(ref _timedOut, 1) == 0)
            {
                Logger.LogInformation("Timeout(" + ConnectionId + ")");

                End();
            }
        }

        public virtual Task KeepAlive()
        {
            return TaskAsyncHelper.Empty;
        }

        public void End()
        {
            if (Interlocked.Exchange(ref _ended, 1) == 0)
            {
                Logger.LogInformation("End(" + ConnectionId + ")");

                if (_connectionEndTokenSource != null)
                {
                    _connectionEndTokenSource.Cancel();
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _connectionEndTokenSource.Dispose();
                _connectionEndRegistration.Dispose();
                _hostRegistration.Dispose();

                ApplyState(TransportConnectionStates.Disposed);
            }
        }

        protected internal Task EnqueueOperation(Func<Task> writeAsync)
        {
            return EnqueueOperation(state => ((Func<Task>)state).Invoke(), writeAsync);
        }

        protected virtual internal Task EnqueueOperation(Func<object, Task> writeAsync, object state)
        {
            if (!IsAlive)
            {
                return TaskAsyncHelper.Empty;
            }

            // Only enqueue new writes if the connection is alive
            Task writeTask = WriteQueue.Enqueue(writeAsync, state);
            _lastWriteTask = writeTask;

            return writeTask;
        }

        protected virtual Task InitializePersistentState()
        {
            _requestLifeTime = new HttpRequestLifeTime(this, WriteQueue, Logger, ConnectionId);

            // Create the TCS that completes when the task returned by PersistentConnection.OnConnected does.
            _connectTcs = new TaskCompletionSource<object>();

            // Create a token that represents the end of this connection's life
            _connectionEndTokenSource = new SafeCancellationTokenSource();
            _connectionEndToken = _connectionEndTokenSource.Token;

            // Handle the shutdown token's callback so we can end our token if it trips
            _hostRegistration = _hostShutdownToken.SafeRegister(state =>
            {
                ((SafeCancellationTokenSource)state).Cancel();
            },
            _connectionEndTokenSource);

            // When the connection ends release the request
            _connectionEndRegistration = CancellationToken.SafeRegister(state =>
            {
                ((HttpRequestLifeTime)state).Complete();
            },
            _requestLifeTime);

            return InitializeMessageId();
        }

        private static void OnDisconnectError(AggregateException ex, object state)
        {
            ((ILogger)state).LogError("Failed to raise disconnect: " + ex.GetBaseException());
        }
    }
}
