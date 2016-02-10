// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


namespace Microsoft.AspNet.SignalR.Hubs
{
    internal class HubContext<THub, TClient> : IHubContext<THub, TClient>
        where THub : IHub
        where TClient : class
    {
        public HubContext(IHubContext dynamicContext)
        {
            // Validate will throw an InvalidOperationException if T is an invalid type
            TypedClientBuilder<TClient>.Validate();

            Clients = new TypedHubConnectionContext<TClient>(dynamicContext.Clients);
            Groups = dynamicContext.Groups;
        }

        public IHubConnectionContext<TClient> Clients { get; private set; }

        public IGroupManager Groups { get; private set; }
    }
}
