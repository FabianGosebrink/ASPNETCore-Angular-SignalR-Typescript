// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Generic;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Extensions.DependencyInjection;

namespace Microsoft.AspNet.SignalR.Infrastructure
{
    /// <summary>
    /// Default <see cref="IConnectionManager"/> implementation.
    /// </summary>
    public class ConnectionManager : IConnectionManager
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IPerformanceCounterManager _counters;

        /// <summary>
        /// Initializes a new instance of the <see cref="ConnectionManager"/> class.
        /// </summary>
        /// <param name="serviceProvider">The <see cref="IDependencyResolver"/>.</param>
        public ConnectionManager(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            _counters = _serviceProvider.GetRequiredService<IPerformanceCounterManager>();
        }

        /// <summary>
        /// Returns a <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.
        /// </summary>
        /// <typeparam name="TConnection">Type of the <see cref="PersistentConnection"/></typeparam>
        /// <returns>A <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.</returns>
        public IPersistentConnectionContext GetConnectionContext<TConnection>()
            where TConnection : PersistentConnection
        {
            return GetConnectionContext(typeof(TConnection));
        }

        /// <summary>
        /// Returns a <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.
        /// </summary>
        /// <param name="type">Type of the <see cref="PersistentConnection"/></param>
        /// <returns>A <see cref="IPersistentConnectionContext"/> for the <see cref="PersistentConnection"/>.</returns>
        public IPersistentConnectionContext GetConnectionContext(Type type)
        {
            if (type == null)
            {
                throw new ArgumentNullException("type");
            }

            string rawConnectionName = type.FullName;
            string connectionName = PrefixHelper.GetPersistentConnectionName(rawConnectionName);
            IConnection connection = GetConnectionCore(connectionName);

            return new PersistentConnectionContext(connection, new GroupManager(connection, PrefixHelper.GetPersistentConnectionGroupName(rawConnectionName)));
        }

        /// <summary>
        /// Returns a <see cref="IHubContext"/> for the specified <see cref="IHub"/>.
        /// </summary>
        /// <typeparam name="THub">Type of the <see cref="IHub"/></typeparam>
        /// <returns>A <see cref="IHubContext"/> for the specified <see cref="IHub"/></returns>
        public IHubContext GetHubContext<THub>()
            where THub : IHub
        {
            return GetHubContext(typeof(THub).GetHubName());
        }

        /// <summary>
        /// Returns a <see cref="IHubContext"/>for the specified hub.
        /// </summary>
        /// <param name="hubName">Name of the hub</param>
        /// <returns>A <see cref="IHubContext"/> for the specified hub</returns>
        public IHubContext GetHubContext(string hubName)
        {
            var connection = GetConnectionCore(connectionName: null);
            var hubManager = _serviceProvider.GetRequiredService<IHubManager>();
            var pipelineInvoker = _serviceProvider.GetRequiredService<IHubPipelineInvoker>();

            hubManager.EnsureHub(hubName,
                _counters.ErrorsHubResolutionTotal,
                _counters.ErrorsHubResolutionPerSec,
                _counters.ErrorsAllTotal,
                _counters.ErrorsAllPerSec);

            return new HubContext(connection, pipelineInvoker, hubName);
        }

        /// <summary>
        /// Returns a <see cref="IHubContext{THub, TClient}"/> for the specified <see cref="IHub"/>.
        /// </summary>
        /// <typeparam name="THub">Type of the <see cref="IHub"/></typeparam>
        /// <typeparam name="TClient">Interface implemented by the client proxy</typeparam>
        /// <returns>A <see cref="IHubContext{THub, TClient}"/> for the specified <see cref="IHub"/></returns>
        public IHubContext<THub, TClient> GetHubContext<THub, TClient>()
            where THub : IHub
            where TClient : class
        {
            var dynamicContext = GetHubContext<THub>();
            return new HubContext<THub, TClient>(dynamicContext);
        }

        internal Connection GetConnectionCore(string connectionName)
        {
            IList<string> signals = connectionName == null ? ListHelper<string>.Empty : new[] { connectionName };

            // Ensure that this server is listening for any ACKs sent over the bus.
            // This is important in case there are any calls to Groups.Add on a context.
            _serviceProvider.GetRequiredService<AckSubscriber>();

            // Give this a unique id
            var connectionId = Guid.NewGuid().ToString();
            return new Connection(_serviceProvider.GetRequiredService<IMessageBus>(),
                                  _serviceProvider.GetRequiredService<JsonSerializer>(),
                                  connectionName,
                                  connectionId,
                                  signals,
                                  ListHelper<string>.Empty,
                                  _serviceProvider.GetRequiredService<ILoggerFactory>(),
                                  _serviceProvider.GetRequiredService<IAckHandler>(),
                                  _serviceProvider.GetRequiredService<IPerformanceCounterManager>(),
                                  _serviceProvider.GetRequiredService<IProtectedData>(),
                                  _serviceProvider.GetRequiredService<IMemoryPool>());
        }
    }
}
