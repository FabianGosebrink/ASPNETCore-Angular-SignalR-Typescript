// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNet.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.OptionsModel;

namespace Microsoft.AspNet.SignalR.Transports
{
    /// <summary>
    /// The default <see cref="ITransportManager"/> implementation.
    /// </summary>
    public class TransportManager : ITransportManager
    {
        private readonly ConcurrentDictionary<string, Func<HttpContext, ITransport>> _transports = new ConcurrentDictionary<string, Func<HttpContext, ITransport>>(StringComparer.OrdinalIgnoreCase);

        /// <summary>
        /// Initializes a new instance of <see cref="TransportManager"/> class.
        /// </summary>
        /// <param name="serviceProvider">The default <see cref="IDependencyResolver"/>.</param>
        [SuppressMessage("Microsoft.Reliability", "CA2000:Dispose objects before losing scope", Justification = "Those are factory methods")]
        public TransportManager(IServiceProvider serviceProvider,
                                IOptions<SignalROptions> optionsAccessor)
        {
            if (serviceProvider == null)
            {
                throw new ArgumentNullException("serviceProvider");
            }
            if (optionsAccessor == null)
            {
                throw new ArgumentNullException("optionsAccessor");
            }

            var enabledTransports = optionsAccessor.Value.Transports.EnabledTransports;

            if (enabledTransports.HasFlag(TransportType.WebSockets))
            {
                Register("webSockets", context => ActivatorUtilities.CreateInstance<WebSocketTransport>(serviceProvider, context));
            }
            if (enabledTransports.HasFlag(TransportType.ServerSentEvents))
            {
                Register("serverSentEvents", context => ActivatorUtilities.CreateInstance<ServerSentEventsTransport>(serviceProvider, context));
            }
            if (enabledTransports.HasFlag(TransportType.ForeverFrame))
            {
                Register("foreverFrame", context => ActivatorUtilities.CreateInstance<ForeverFrameTransport>(serviceProvider, context));
            }
            if (enabledTransports.HasFlag(TransportType.LongPolling))
            {
                Register("longPolling", context => ActivatorUtilities.CreateInstance<LongPollingTransport>(serviceProvider, context));
            }

            if (_transports.Count == 0)
            {
                throw new InvalidOperationException(Resources.Error_NoTransportsEnabled);
            }
        }

        /// <summary>
        /// Adds a new transport to the list of supported transports.
        /// </summary>
        /// <param name="transportName">The specified transport.</param>
        /// <param name="transportFactory">The factory method for the specified transport.</param>
        public void Register(string transportName, Func<HttpContext, ITransport> transportFactory)
        {
            if (String.IsNullOrEmpty(transportName))
            {
                throw new ArgumentNullException("transportName");
            }

            if (transportFactory == null)
            {
                throw new ArgumentNullException("transportFactory");
            }

            _transports.TryAdd(transportName, transportFactory);
        }

        /// <summary>
        /// Removes a transport from the list of supported transports.
        /// </summary>
        /// <param name="transportName">The specified transport.</param>
        public void Remove(string transportName)
        {
            if (String.IsNullOrEmpty(transportName))
            {
                throw new ArgumentNullException("transportName");
            }

            Func<HttpContext, ITransport> removed;
            _transports.TryRemove(transportName, out removed);
        }

        /// <summary>
        /// Gets the specified transport for the specified <see cref="HttpContext"/>.
        /// </summary>
        /// <param name="context">The <see cref="HttpContext"/> for the current request.</param>
        /// <returns>The <see cref="ITransport"/> for the specified <see cref="HttpContext"/>.</returns>
        public ITransport GetTransport(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            string transportName = context.Request.Query["transport"];

            if (String.IsNullOrEmpty(transportName))
            {
                return null;
            }

            Func<HttpContext, ITransport> factory;
            if (_transports.TryGetValue(transportName, out factory))
            {
                return factory(context);
            }

            return null;
        }

        /// <summary>
        /// Determines whether the specified transport is supported.
        /// </summary>
        /// <param name="transportName">The name of the transport to test.</param>
        /// <returns>True if the transport is supported, otherwise False.</returns>
        public bool SupportsTransport(string transportName)
        {
            if (String.IsNullOrEmpty(transportName))
            {
                return false;
            }

            return _transports.ContainsKey(transportName);
        }
    }
}
