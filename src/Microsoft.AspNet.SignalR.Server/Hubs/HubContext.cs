// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using Microsoft.AspNet.SignalR.Infrastructure;

namespace Microsoft.AspNet.SignalR.Hubs
{
    internal class HubContext : IHubContext
    {
        public HubContext(IConnection connection, IHubPipelineInvoker invoker, string hubName)
        {
            Clients = new HubConnectionContextBase(connection, invoker, hubName);
            Groups = new GroupManager(connection, PrefixHelper.GetHubGroupName(hubName));
        }

        public IHubConnectionContext<dynamic> Clients { get; private set; }

        public IGroupManager Groups { get; private set; }
    }
}
