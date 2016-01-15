// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;

namespace Microsoft.AspNet.SignalR.Hubs
{
    public class TypedHubCallerConnectionContext<TClient> : TypedHubConnectionContext<TClient>, IHubCallerConnectionContext<TClient>
        where TClient : class
    {
        private IHubCallerConnectionContext<dynamic> _dynamicContext;

        public TypedHubCallerConnectionContext(IHubCallerConnectionContext<dynamic> dynamicContext)
            : base(dynamicContext)
        {
            _dynamicContext = dynamicContext;
        }

        public TClient Caller
        {
            get
            {
                return TypedClientBuilder<TClient>.Build(_dynamicContext.Caller);
            }
        }

        public dynamic CallerState
        {
            get
            {
                return _dynamicContext.CallerState;
            }
        }

        public TClient Others
        {
            get
            {
                return TypedClientBuilder<TClient>.Build(_dynamicContext.Others);
            }
        }

        public TClient OthersInGroup(string groupName)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.OthersInGroup(groupName));
        }

        public TClient OthersInGroups(IList<string> groupNames)
        {
            return TypedClientBuilder<TClient>.Build(_dynamicContext.OthersInGroups(groupNames));
        }
    }
}
