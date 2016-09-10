// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    internal class HubInvokerContext : IHubIncomingInvokerContext
    {
        public HubInvokerContext(IHub hub, MethodDescriptor methodDescriptor, IList<object> args)
        {
            Hub = hub;
            MethodDescriptor = methodDescriptor;
            Args = args;
        }

        public IHub Hub
        {
            get;
            private set;
        }

        public MethodDescriptor MethodDescriptor
        {
            get;
            private set;
        }

        public IList<object> Args
        {
            get;
            private set;
        }
    }
}
