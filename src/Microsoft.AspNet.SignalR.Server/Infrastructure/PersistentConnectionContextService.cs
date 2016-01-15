// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


namespace Microsoft.AspNet.SignalR.Infrastructure
{
    public class PersistentConnectionContextService<TConnection> : IPersistentConnectionContext<TConnection>
        where TConnection : PersistentConnection
    {
        private readonly IPersistentConnectionContext _connectionContext;

        public PersistentConnectionContextService(IConnectionManager connectionManager)
        {
            _connectionContext = connectionManager.GetConnectionContext<TConnection>();
        }

        public IConnection Connection
        {
            get
            {
                return _connectionContext.Connection;
            }
        }

        public IConnectionGroupManager Groups
        {
            get
            {
                return _connectionContext.Groups;
            }
        }
    }
}
