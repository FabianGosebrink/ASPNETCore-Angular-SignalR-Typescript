// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using Microsoft.AspNet.SignalR.Infrastructure;

namespace Microsoft.AspNet.SignalR.Hubs
{
    public class HubContextService<THub, TClient> : IHubContext<THub, TClient>
        where THub : IHub
        where TClient : class
    {
        private readonly IHubContext<THub, TClient> _hubContext;

        public HubContextService(IConnectionManager connectionManager)
        {
            _hubContext = connectionManager.GetHubContext<THub, TClient>();
        }

        public IHubConnectionContext<TClient> Clients
        {
            get
            {
                return _hubContext.Clients;
            }
        }

        public IGroupManager Groups
        {
            get
            {
                return _hubContext.Groups;
            }
        }
    }
}
