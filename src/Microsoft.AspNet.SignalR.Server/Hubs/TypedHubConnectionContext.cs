// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;

namespace Microsoft.AspNet.SignalR.Hubs
{
    public class TypedHubConnectionContext<TClient> : IHubConnectionContext<TClient>
        where TClient : class
    {
        private IHubConnectionContext<dynamic> _dynamicContext;

        public TypedHubConnectionContext(IHubConnectionContext<dynamic> dynamicContext)
        {
            _dynamicContext = dynamicContext;
        }

        public TClient All
        {
            get
            {
                return TypedClientBuilder<TClient>.Build(_dynamicContext.All);
            }
        }

        public TClient AllExcept(params string[] excludeConnectionIds)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.AllExcept(excludeConnectionIds));
        }

        public TClient Client(string connectionId)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.Client(connectionId));
        }

        public TClient Clients(IList<string> connectionIds)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.Clients(connectionIds));
        }

        public TClient Group(string groupName, params string[] excludeConnectionIds)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.Group(groupName, excludeConnectionIds));
        }

        public TClient Groups(IList<string> groupNames, params string[] excludeConnectionIds)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.Groups(groupNames, excludeConnectionIds));
        }

        public TClient User(string userId)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.User(userId));
        }

        public TClient Users(IList<string> userIds)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.Users(userIds));
        }
    }
}
