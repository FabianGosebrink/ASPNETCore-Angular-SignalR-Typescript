// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNet.SignalR.Hubs;

namespace Microsoft.AspNet.SignalR.Infrastructure
{
    /// <summary>
    /// Provides access to hubs and persistent connections references.
    /// </summary>
    public interface IConnectionManager
    {
        /// <summary>
        /// Returns a <see cref="IHubContext"/> for the specified <see cref="IHub"/>.
        /// </summary>
        /// <typeparam name="THub">Type of the <see cref="IHub"/></typeparam>
        /// <returns>A <see cref="IHubContext"/> for the specified <see cref="IHub"/></returns>
        [SuppressMessage("Microsoft.Design", "CA1004:GenericMethodsShouldProvideTypeParameter", Justification = "The hub type needs to be specified")]
        IHubContext GetHubContext<THub>()
            where THub : IHub;

        /// <summary>
        /// Returns a <see cref="IHubContext"/>for the specified hub.
        /// </summary>
        /// <param name="hubName">Name of the hub</param>
        /// <returns>A <see cref="IHubContext"/> for the specified hub</returns>
        IHubContext GetHubContext(string hubName);

        /// <summary>
        /// Returns a <see cref="IHubContext{THub, TClient}"/> for the specified <see cref="IHub"/>.
        /// </summary>
        /// <typeparam name="THub">Type of the <see cref="IHub"/></typeparam>
        /// <typeparam name="TClient">Interface implemented by the client proxy</typeparam>
        /// <returns>A <see cref="IHubContext{THub, TClient}"/> for the specified <see cref="IHub"/></returns>
        [SuppressMessage("Microsoft.Design", "CA1004:GenericMethodsShouldProvideTypeParameter", Justification = "The hub type needs to be specified")]
        IHubContext<THub, TClient> GetHubContext<THub, TClient>()
            where THub : IHub
            where TClient : class;

        /// <summary>
        /// Returns a <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.
        /// </summary>
        /// <typeparam name="TConnection">Type of the <see cref="PersistentConnection"/></typeparam>
        /// <returns>A <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.</returns>
        [SuppressMessage("Microsoft.Design", "CA1004:GenericMethodsShouldProvideTypeParameter", Justification = "The connection type needs to be specified")]
        IPersistentConnectionContext GetConnectionContext<TConnection>()
            where TConnection : PersistentConnection;

        /// <summary>
        /// Returns a <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.
        /// </summary>
        /// <param name="type">Type of the <see cref="PersistentConnection"/></param>
        /// <returns>A <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.</returns>
        IPersistentConnectionContext GetConnectionContext(Type type);
    }
}
