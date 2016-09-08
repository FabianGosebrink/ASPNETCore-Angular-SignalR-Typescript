// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    internal class HubPipeline : IHubPipelineInvoker
    {
        private readonly Lazy<ComposedPipeline> _pipeline;

        public HubPipeline(IOptions<SignalROptions> options)
        {
            _pipeline = new Lazy<ComposedPipeline>(() => new ComposedPipeline(options.Value.Hubs.PipelineModules));
        }

        private ComposedPipeline Pipeline
        {
            get { return _pipeline.Value; }
        }

        public Task<object> Invoke(IHubIncomingInvokerContext context)
        {
            return Pipeline.Invoke(context);
        }

        public Task Connect(IHub hub)
        {
            return Pipeline.Connect(hub);
        }

        public Task Reconnect(IHub hub)
        {
            return Pipeline.Reconnect(hub);
        }

        public Task Disconnect(IHub hub, bool stopCalled)
        {
            return Pipeline.Disconnect(hub, stopCalled);
        }

        public bool AuthorizeConnect(HubDescriptor hubDescriptor, HttpRequest request)
        {
            return Pipeline.AuthorizeConnect(hubDescriptor, request);
        }

        public IList<string> RejoiningGroups(HubDescriptor hubDescriptor, HttpRequest request, IList<string> groups)
        {
            return Pipeline.RejoiningGroups(hubDescriptor, request, groups);
        }

        public Task Send(IHubOutgoingInvokerContext context)
        {
            return Pipeline.Send(context);
        }

        private class ComposedPipeline
        {
            public Func<IHubIncomingInvokerContext, Task<object>> Invoke;
            public Func<IHub, Task> Connect;
            public Func<IHub, Task> Reconnect;
            public Func<IHub, bool, Task> Disconnect;
            public Func<HubDescriptor, HttpRequest, bool> AuthorizeConnect;
            public Func<HubDescriptor, HttpRequest, IList<string>, IList<string>> RejoiningGroups;
            public Func<IHubOutgoingInvokerContext, Task> Send;

            public ComposedPipeline(IEnumerable<IHubPipelineModule> modules)
            {
                // This wouldn't look nearly as gnarly if C# had better type inference, but now we don't need the ComposedModule or PassThroughModule.
                Invoke = Compose<Func<IHubIncomingInvokerContext, Task<object>>>(modules, (m, f) => m.BuildIncoming(f))(HubDispatcher.Incoming);
                Connect = Compose<Func<IHub, Task>>(modules, (m, f) => m.BuildConnect(f))(HubDispatcher.Connect);
                Reconnect = Compose<Func<IHub, Task>>(modules, (m, f) => m.BuildReconnect(f))(HubDispatcher.Reconnect);
                Disconnect = Compose<Func<IHub, bool, Task>>(modules, (m, f) => m.BuildDisconnect(f))(HubDispatcher.Disconnect);
                AuthorizeConnect = Compose<Func<HubDescriptor, HttpRequest, bool>>(modules, (m, f) => m.BuildAuthorizeConnect(f))((h, r) => true);
                RejoiningGroups = Compose<Func<HubDescriptor, HttpRequest, IList<string>, IList<string>>>(modules, (m, f) => m.BuildRejoiningGroups(f))((h, r, g) => g);
                Send = Compose<Func<IHubOutgoingInvokerContext, Task>>(modules, (m, f) => m.BuildOutgoing(f))(HubDispatcher.Outgoing);
            }

            // IHubPipelineModule could be turned into a second generic parameter, but it would make the above invocations even longer than they currently are.
            private static Func<T, T> Compose<T>(IEnumerable<IHubPipelineModule> modules, Func<IHubPipelineModule, T, T> method)
            {
                // Notice we are reversing and aggregating in one step. (Function composition is associative) 
                return modules.Aggregate<IHubPipelineModule, Func<T, T>>(x => x, (a, b) => (x => method(b, a(x))));
            }
        }
    }
}
