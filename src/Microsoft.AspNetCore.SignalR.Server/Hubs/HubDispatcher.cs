// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.AspNetCore.SignalR.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    /// <summary>
    /// Handles all communication over the hubs persistent connection.
    /// </summary>
    [SuppressMessage("Microsoft.Maintainability", "CA1506:AvoidExcessiveClassCoupling", Justification = "This dispatcher makes use of many interfaces.")]
    public class HubDispatcher : PersistentConnection
    {
        private const string HubsSuffix = "/hubs";
        private const string JsSuffix = "/js";

        private readonly List<HubDescriptor> _hubs = new List<HubDescriptor>();
        private readonly bool _enableJavaScriptProxies;
        private readonly bool _enableDetailedErrors;

        private IJavaScriptProxyGenerator _proxyGenerator;
        private IHubManager _manager;
        private IHubRequestParser _requestParser;
        private JsonSerializer _serializer;
        private IParameterResolver _binder;
        private IHubPipelineInvoker _pipelineInvoker;
        private IPerformanceCounterManager _counters;
        private bool _isDebuggingEnabled = false;

        private static readonly MethodInfo _continueWithMethod = typeof(HubDispatcher).GetMethod("ContinueWith", BindingFlags.NonPublic | BindingFlags.Static);

        /// <summary>
        /// Initializes an instance of the <see cref="HubDispatcher"/> class.
        /// </summary>
        /// <param name="options">Configuration settings determining whether to enable JS proxies and provide clients with detailed hub errors.</param>
        public HubDispatcher(IOptions<SignalROptions> optionsAccessor)
        {
            if (optionsAccessor == null)
            {
                throw new ArgumentNullException("optionsAccessor");
            }

            var options = optionsAccessor.Value;
            _enableJavaScriptProxies = options.Hubs.EnableJavaScriptProxies;
            _enableDetailedErrors = options.Hubs.EnableDetailedErrors;
        }

        protected override ILogger Logger
        {
            get
            {
                return LoggerFactory.CreateLogger<HubDispatcher>();
            }
        }

        internal override string GroupPrefix
        {
            get
            {
                return PrefixHelper.HubGroupPrefix;
            }
        }

        public override void Initialize(IServiceProvider serviceProvider)
        {
            if (serviceProvider == null)
            {
                throw new ArgumentNullException(nameof(serviceProvider));
            }

            _proxyGenerator = _enableJavaScriptProxies ? serviceProvider.GetRequiredService<IJavaScriptProxyGenerator>()
                                                       : new EmptyJavaScriptProxyGenerator();

            _manager = serviceProvider.GetRequiredService<IHubManager>();
            _binder = serviceProvider.GetRequiredService<IParameterResolver>();
            _requestParser = serviceProvider.GetRequiredService<IHubRequestParser>();
            _serializer = serviceProvider.GetRequiredService<JsonSerializer>();
            _pipelineInvoker = serviceProvider.GetRequiredService<IHubPipelineInvoker>();
            _counters = serviceProvider.GetRequiredService<IPerformanceCounterManager>();

            base.Initialize(serviceProvider);
        }

        protected override bool AuthorizeRequest(HttpRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }

            // Populate _hubs
            string data = request.Query["connectionData"];

            if (!String.IsNullOrEmpty(data))
            {
                var clientHubInfo = JsonSerializer.Parse<IEnumerable<ClientHubInfo>>(data);

                // If there's any hubs then perform the auth check
                if (clientHubInfo != null && clientHubInfo.Any())
                {
                    var hubCache = new Dictionary<string, HubDescriptor>(StringComparer.OrdinalIgnoreCase);

                    foreach (var hubInfo in clientHubInfo)
                    {
                        if (hubCache.ContainsKey(hubInfo.Name))
                        {
                            throw new InvalidOperationException(Resources.Error_DuplicateHubNamesInConnectionData);
                        }

                        // Try to find the associated hub type
                        HubDescriptor hubDescriptor = _manager.EnsureHub(hubInfo.Name,
                                                        _counters.ErrorsHubResolutionTotal,
                                                        _counters.ErrorsHubResolutionPerSec,
                                                        _counters.ErrorsAllTotal,
                                                        _counters.ErrorsAllPerSec);

                        if (_pipelineInvoker.AuthorizeConnect(hubDescriptor, request))
                        {
                            // Add this to the list of hub descriptors this connection is interested in
                            hubCache.Add(hubDescriptor.Name, hubDescriptor);
                        }
                    }

                    _hubs.AddRange(hubCache.Values);

                    // If we have any hubs in the list then we're authorized
                    return _hubs.Count > 0;
                }
            }

            return base.AuthorizeRequest(request);
        }

        /// <summary>
        /// Processes the hub's incoming method calls.
        /// </summary>
        protected override Task OnReceived(HttpRequest request, string connectionId, string data)
        {
            HubRequest hubRequest = _requestParser.Parse(data, _serializer);

            // Create the hub
            HubDescriptor descriptor = _manager.EnsureHub(hubRequest.Hub,
                _counters.ErrorsHubInvocationTotal,
                _counters.ErrorsHubInvocationPerSec,
                _counters.ErrorsAllTotal,
                _counters.ErrorsAllPerSec);

            IJsonValue[] parameterValues = hubRequest.ParameterValues;

            // Resolve the method

            MethodDescriptor methodDescriptor = _manager.GetHubMethod(descriptor.Name, hubRequest.Method, parameterValues);

            if (methodDescriptor == null)
            {
                // Empty (noop) method descriptor
                // Use: Forces the hub pipeline module to throw an error.  This error is encapsulated in the HubDispatcher.
                //      Encapsulating it in the HubDispatcher prevents the error from bubbling up to the transport level.
                //      Specifically this allows us to return a faulted task (call .fail on client) and to not cause the
                //      transport to unintentionally fail.
                IEnumerable<MethodDescriptor> availableMethods = _manager.GetHubMethods(descriptor.Name, m => m.Name == hubRequest.Method);
                methodDescriptor = new NullMethodDescriptor(descriptor, hubRequest.Method, availableMethods);
            }

            var hub = CreateHub(request, descriptor, connectionId, throwIfFailedToCreate: true);

            return InvokeHubPipeline(hub, parameterValues, methodDescriptor, hubRequest)
                .ContinueWithPreservedCulture(task => hub.Dispose(), TaskContinuationOptions.ExecuteSynchronously);
        }

        [SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Exceptions are flown to the caller.")]
        private Task InvokeHubPipeline(IHub hub,
                                       IJsonValue[] parameterValues,
                                       MethodDescriptor methodDescriptor,
                                       HubRequest hubRequest)
        {
            // TODO: Make adding parameters here pluggable? IValueProvider? ;)
            HubInvocationProgress progress = GetProgressInstance(methodDescriptor, value => SendProgressUpdate(hub.Context.ConnectionId, value, hubRequest), Logger);

            Task<object> piplineInvocation;
            try
            {
                var args = _binder.ResolveMethodParameters(methodDescriptor, parameterValues);

                // We need to add the IProgress<T> instance after resolving the method as the resolution
                // itself looks for overload matches based on the incoming arg values
                if (progress != null)
                {
                    args = args.Concat(new[] { progress }).ToList();
                }

                var context = new HubInvokerContext(hub, methodDescriptor, args);

                // Invoke the pipeline and save the task
                piplineInvocation = _pipelineInvoker.Invoke(context);
            }
            catch (Exception ex)
            {
                piplineInvocation = TaskAsyncHelper.FromError<object>(ex);
            }

            // Determine if we have a faulted task or not and handle it appropriately.
            return piplineInvocation.ContinueWithPreservedCulture(task =>
            {
                if (progress != null)
                {
                    // Stop ability to send any more progress updates
                    progress.SetComplete();
                }

                if (task.IsFaulted)
                {
                    return ProcessResponse(result: null, request: hubRequest, error: task.Exception);
                }
                else if (task.IsCanceled)
                {
                    return ProcessResponse(result: null, request: hubRequest, error: new OperationCanceledException());
                }
                else
                {
                    return ProcessResponse(task.Result, hubRequest, error: null);
                }
            })
            .FastUnwrap();
        }

        private static HubInvocationProgress GetProgressInstance(MethodDescriptor methodDescriptor, Func<object, Task> sendProgressFunc, ILogger logger)
        {
            HubInvocationProgress progress = null;
            if (methodDescriptor.ProgressReportingType != null)
            {
                progress = HubInvocationProgress.Create(methodDescriptor.ProgressReportingType, sendProgressFunc, logger);
            }
            return progress;
        }

        public override Task ProcessRequestCore(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            // Trim any trailing slashes
            string normalized = context.Request.LocalPath().TrimEnd('/');

            int suffixLength = -1;
            if (normalized.EndsWith(HubsSuffix, StringComparison.OrdinalIgnoreCase))
            {
                suffixLength = HubsSuffix.Length;
            }
            else if (normalized.EndsWith(JsSuffix, StringComparison.OrdinalIgnoreCase))
            {
                suffixLength = JsSuffix.Length;
            }

            if (suffixLength != -1)
            {
                // Generate the proper JS proxy url
                string hubUrl = normalized.Substring(0, normalized.Length - suffixLength);

                // Generate the proxy
                context.Response.ContentType = JsonUtility.JavaScriptMimeType;
                return context.Response.End(_proxyGenerator.GenerateProxy(hubUrl));
            }

            // TODO: Is debugging enabled
            // _isDebuggingEnabled = context.Environment.IsDebugEnabled();

            return base.ProcessRequestCore(context);
        }

        internal static Task Connect(IHub hub)
        {
            return hub.OnConnected();
        }

        internal static Task Reconnect(IHub hub)
        {
            return hub.OnReconnected();
        }

        internal static Task Disconnect(IHub hub, bool stopCalled)
        {
            return hub.OnDisconnected(stopCalled);
        }

        [SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "A faulted task is returned.")]
        internal static Task<object> Incoming(IHubIncomingInvokerContext context)
        {
            var tcs = new TaskCompletionSource<object>();

            try
            {
                object result = context.MethodDescriptor.Invoker(context.Hub, context.Args.ToArray());
                Type returnType = context.MethodDescriptor.ReturnType;

                if (typeof(Task).IsAssignableFrom(returnType))
                {
                    var task = (Task)result;
                    if (!returnType.GetTypeInfo().IsGenericType)
                    {
                        task.ContinueWith(tcs);
                    }
                    else
                    {
                        // Get the <T> in Task<T>
                        Type resultType = returnType.GetGenericArguments().Single();

                        Type genericTaskType = typeof(Task<>).MakeGenericType(resultType);

                        // Get the correct ContinueWith overload
                        var parameter = Expression.Parameter(typeof(object));

                        // TODO: Cache this whole thing
                        // Action<object> callback = result => ContinueWith((Task<T>)result, tcs);
                        MethodInfo continueWithMethod = _continueWithMethod.MakeGenericMethod(resultType);

                        Expression body = Expression.Call(continueWithMethod,
                                                          Expression.Convert(parameter, genericTaskType),
                                                          Expression.Constant(tcs));

                        var continueWithInvoker = Expression.Lambda<Action<object>>(body, parameter).Compile();
                        continueWithInvoker.Invoke(result);
                    }
                }
                else
                {
                    tcs.TrySetResult(result);
                }
            }
            catch (Exception ex)
            {
                tcs.TrySetUnwrappedException(ex);
            }

            return tcs.Task;
        }

        internal static Task Outgoing(IHubOutgoingInvokerContext context)
        {
            ConnectionMessage message = context.GetConnectionMessage();

            return context.Connection.Send(message);
        }

        protected override Task OnConnected(HttpRequest request, string connectionId)
        {
            return ExecuteHubEvent(request, connectionId, hub => _pipelineInvoker.Connect(hub));
        }

        protected override Task OnReconnected(HttpRequest request, string connectionId)
        {
            return ExecuteHubEvent(request, connectionId, hub => _pipelineInvoker.Reconnect(hub));
        }

        protected override IList<string> OnRejoiningGroups(HttpRequest request, IList<string> groups, string connectionId)
        {
            return _hubs.Select(hubDescriptor =>
            {
                string groupPrefix = hubDescriptor.Name + ".";

                var hubGroups = groups.Where(g => g.StartsWith(groupPrefix, StringComparison.OrdinalIgnoreCase))
                                      .Select(g => g.Substring(groupPrefix.Length))
                                      .ToList();

                return _pipelineInvoker.RejoiningGroups(hubDescriptor, request, hubGroups)
                                        .Select(g => groupPrefix + g);

            }).SelectMany(groupsToRejoin => groupsToRejoin).ToList();
        }

        protected override Task OnDisconnected(HttpRequest request, string connectionId, bool stopCalled)
        {
            return ExecuteHubEvent(request, connectionId, hub => _pipelineInvoker.Disconnect(hub, stopCalled));
        }

        protected override IList<string> GetSignals(string userId, string connectionId)
        {
            var signals = _hubs.SelectMany(info =>
            {
                var items = new List<string>
                {
                    PrefixHelper.GetHubName(info.Name),
                    PrefixHelper.GetHubConnectionId(info.CreateQualifiedName(connectionId)),
                };

                if (!String.IsNullOrEmpty(userId))
                {
                    items.Add(PrefixHelper.GetHubUserId(info.CreateQualifiedName(userId)));
                }

                return items;
            })
            .Concat(new[]
            {
                PrefixHelper.GetConnectionId(connectionId)
            });

            return signals.ToList();
        }

        private Task ExecuteHubEvent(HttpRequest request, string connectionId, Func<IHub, Task> action)
        {
            var hubs = GetHubs(request, connectionId).ToList();
            var operations = hubs.Select(instance => action(instance).OrEmpty().Catch(Logger)).ToArray();

            if (operations.Length == 0)
            {
                DisposeHubs(hubs);
                return TaskAsyncHelper.Empty;
            }

            var tcs = new TaskCompletionSource<object>();
            Task.Factory.ContinueWhenAll(operations, tasks =>
            {
                DisposeHubs(hubs);
                var faulted = tasks.FirstOrDefault(t => t.IsFaulted);
                if (faulted != null)
                {
                    tcs.SetUnwrappedException(faulted.Exception);
                }
                else if (tasks.Any(t => t.IsCanceled))
                {
                    tcs.SetCanceled();
                }
                else
                {
                    tcs.SetResult(null);
                }
            });

            return tcs.Task;
        }

        private IHub CreateHub(HttpRequest request, HubDescriptor descriptor, string connectionId, bool throwIfFailedToCreate = false)
        {
            try
            {
                var hub = _manager.ResolveHub(descriptor.Name);

                if (hub != null)
                {
                    hub.Context = new HubCallerContext(request, connectionId);
                    hub.Clients = new HubConnectionContext(_pipelineInvoker, Connection, descriptor.Name, connectionId);
                    hub.Groups = new GroupManager(Connection, PrefixHelper.GetHubGroupName(descriptor.Name));
                }

                return hub;
            }
            catch (Exception ex)
            {
                Logger.LogInformation(String.Format("Error creating Hub {0}. {1}", descriptor.Name, ex.Message));

                if (throwIfFailedToCreate)
                {
                    throw;
                }

                return null;
            }
        }

        private IEnumerable<IHub> GetHubs(HttpRequest request, string connectionId)
        {
            return from descriptor in _hubs
                   select CreateHub(request, descriptor, connectionId) into hub
                   where hub != null
                   select hub;
        }

        private static void DisposeHubs(IEnumerable<IHub> hubs)
        {
            foreach (var hub in hubs)
            {
                hub.Dispose();
            }
        }

        private Task SendProgressUpdate(string connectionId, object value, HubRequest request)
        {
            var hubResult = new HubResponse
            {
                Progress = new { I = request.Id, D = value },
                // We prefix the ID here to ensure old clients treat this as a hub response
                // but fail to lookup a corresponding callback and thus no-op
                Id = "P|" + request.Id,
            };

            return Connection.Send(connectionId, hubResult);
        }

        private Task ProcessResponse(object result, HubRequest request, Exception error)
        {
            var hubResult = new HubResponse
            {
                Result = result,
                Id = request.Id,
            };

            if (error != null)
            {
                _counters.ErrorsHubInvocationTotal.Increment();
                _counters.ErrorsHubInvocationPerSec.Increment();
                _counters.ErrorsAllTotal.Increment();
                _counters.ErrorsAllPerSec.Increment();

                var hubError = error.InnerException as HubException;

                if (_enableDetailedErrors || hubError != null)
                {
                    var exception = error.InnerException ?? error;
                    hubResult.StackTrace = _isDebuggingEnabled ? exception.StackTrace : null;
                    hubResult.Error = exception.Message;

                    if (hubError != null)
                    {
                        hubResult.IsHubException = true;
                        hubResult.ErrorData = hubError.ErrorData;
                    }
                }
                else
                {
                    hubResult.Error = String.Format(CultureInfo.CurrentCulture, Resources.Error_HubInvocationFailed, request.Hub, request.Method);
                }
            }

            return Transport.Send(hubResult);
        }

        private static void ContinueWith<T>(Task<T> task, TaskCompletionSource<object> tcs)
        {
            if (task.IsCompleted)
            {
                // Fast path for tasks that completed synchronously
                ContinueSync<T>(task, tcs);
            }
            else
            {
                ContinueAsync<T>(task, tcs);
            }
        }

        private static void ContinueSync<T>(Task<T> task, TaskCompletionSource<object> tcs)
        {
            if (task.IsFaulted)
            {
                tcs.TrySetUnwrappedException(task.Exception);
            }
            else if (task.IsCanceled)
            {
                tcs.TrySetCanceled();
            }
            else
            {
                tcs.TrySetResult(task.Result);
            }
        }

        private static void ContinueAsync<T>(Task<T> task, TaskCompletionSource<object> tcs)
        {
            task.ContinueWithPreservedCulture(t =>
            {
                if (t.IsFaulted)
                {
                    tcs.TrySetUnwrappedException(t.Exception);
                }
                else if (t.IsCanceled)
                {
                    tcs.TrySetCanceled();
                }
                else
                {
                    tcs.TrySetResult(t.Result);
                }
            });
        }

        [SuppressMessage("Microsoft.Performance", "CA1812:AvoidUninstantiatedInternalClasses", Justification = "It is instantiated through JSON deserialization.")]
        private class ClientHubInfo
        {
            public string Name { get; set; }
        }
    }
}
