// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using Microsoft.AspNet.SignalR.Infrastructure;

namespace Microsoft.AspNet.SignalR.Hubs
{
    public class HubContextService<THub> : IHubContext<THub>
        where THub : IHub
    {
        private readonly IHubContext _hubContext;

        public HubContextService(IConnectionManager connectionManager)
        {
            _hubContext = connectionManager.GetHubContext<THub>();
        }

        public IHubConnectionContext<dynamic> Clients
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
