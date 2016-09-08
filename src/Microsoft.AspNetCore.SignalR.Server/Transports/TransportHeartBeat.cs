// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using Microsoft.AspNetCore.SignalR.Configuration;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Microsoft.AspNetCore.SignalR.Transports
{
    /// <summary>
    /// Default implementation of <see cref="ITransportHeartbeat"/>.
    /// </summary>
    public class TransportHeartbeat : ITransportHeartbeat, IDisposable
    {
        private readonly ConcurrentDictionary<string, ConnectionMetadata> _connections = new ConcurrentDictionary<string, ConnectionMetadata>();
        private readonly Timer _timer;
        private readonly TransportOptions _transportOptions;
        private readonly ILogger _logger;
        private readonly IPerformanceCounterManager _counters;
        private readonly object _counterLock = new object();

        private int _running;
        private ulong _heartbeatCount;

        /// <summary>
        /// Initializes and instance of the <see cref="TransportHeartbeat"/> class.
        /// </summary>
        /// <param name="serviceProvider">The <see cref="IDependencyResolver"/>.</param>
        public TransportHeartbeat(IOptions<SignalROptions> optionsAccessor,
                                  IPerformanceCounterManager counters,
                                  ILoggerFactory loggerFactory)
        {
            _transportOptions = optionsAccessor.Value.Transports;
            _counters = counters;
            _logger = loggerFactory.CreateLogger<TransportHeartbeat>();

            // REVIEW: When to dispose the timer?
            _timer = new Timer(Beat,
                               null,
                               _transportOptions.HeartbeatInterval(),
                               _transportOptions.HeartbeatInterval());
        }

        private ILogger Logger
        {
            get
            {
                return _logger;
            }
        }


        /// <summary>
        /// Adds a new connection to the list of tracked connections.
        /// </summary>
        /// <param name="connection">The connection to be added.</param>
        public ITrackingConnection AddOrUpdateConnection(ITrackingConnection connection)
        {
            if (connection == null)
            {
                throw new ArgumentNullException("connection");
            }

            var newMetadata = new ConnectionMetadata(connection);
            bool isNewConnection = true;
            ITrackingConnection oldConnection = null;

            _connections.AddOrUpdate(connection.ConnectionId, newMetadata, (key, old) =>
            {
                Logger.LogDebug(String.Format("Connection {0} exists. Closing previous connection.", old.Connection.ConnectionId));
                // Kick out the older connection. This should only happen when 
                // a previous connection attempt fails on the client side (e.g. transport fallback).

                old.Connection.ApplyState(TransportConnectionStates.Replaced);

                // Don't bother disposing the registration here since the token source
                // gets disposed after the request has ended
                old.Connection.End();

                // If we have old metadata this isn't a new connection
                isNewConnection = false;
                oldConnection = old.Connection;

                return newMetadata;
            });

            if (isNewConnection)
            {
                Logger.LogInformation(String.Format("Connection {0} is New.", connection.ConnectionId));
                connection.IncrementConnectionsCount();
            }

            lock (_counterLock)
            {
                _counters.ConnectionsCurrent.RawValue = _connections.Count;
            }

            // Set the initial connection time
            newMetadata.Initial = DateTime.UtcNow;

            newMetadata.Connection.ApplyState(TransportConnectionStates.Added);

            return oldConnection;
        }

        /// <summary>
        /// Removes a connection from the list of tracked connections.
        /// </summary>
        /// <param name="connection">The connection to remove.</param>
        public void RemoveConnection(ITrackingConnection connection)
        {
            if (connection == null)
            {
                throw new ArgumentNullException("connection");
            }

            // Remove the connection and associated metadata
            ConnectionMetadata metadata;
            if (_connections.TryRemove(connection.ConnectionId, out metadata))
            {
                connection.DecrementConnectionsCount();
                lock (_counterLock)
                {
                    _counters.ConnectionsCurrent.RawValue = _connections.Count;
                }

                connection.ApplyState(TransportConnectionStates.Removed);

                Logger.LogInformation(String.Format("Removing connection {0}", connection.ConnectionId));
            }
        }

        /// <summary>
        /// Marks an existing connection as active.
        /// </summary>
        /// <param name="connection">The connection to mark.</param>
        public void MarkConnection(ITrackingConnection connection)
        {
            if (connection == null)
            {
                throw new ArgumentNullException("connection");
            }

            // Do nothing if the connection isn't alive
            if (!connection.IsAlive)
            {
                return;
            }

            ConnectionMetadata metadata;
            if (_connections.TryGetValue(connection.ConnectionId, out metadata))
            {
                metadata.LastMarked = DateTime.UtcNow;
            }
        }

        public IList<ITrackingConnection> GetConnections()
        {
            return _connections.Values.Select(metadata => metadata.Connection).ToList();
        }

        [SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "We're tracing exceptions and don't want to crash the process.")]
        private void Beat(object state)
        {
            if (Interlocked.Exchange(ref _running, 1) == 1)
            {
                Logger.LogDebug("Timer handler took longer than current interval");
                return;
            }

            lock (_counterLock)
            {
                _counters.ConnectionsCurrent.RawValue = _connections.Count;
            }

            try
            {
                _heartbeatCount++;

                foreach (var metadata in _connections.Values)
                {
                    if (metadata.Connection.IsAlive)
                    {
                        CheckTimeoutAndKeepAlive(metadata);
                    }
                    else
                    {
                        Logger.LogDebug(metadata.Connection.ConnectionId + " is dead");

                        // Check if we need to disconnect this connection
                        CheckDisconnect(metadata);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.LogError("SignalR error during transport heart beat on background thread: {0}", ex);
            }
            finally
            {
                Interlocked.Exchange(ref _running, 0);
            }
        }

        private void CheckTimeoutAndKeepAlive(ConnectionMetadata metadata)
        {
            if (RaiseTimeout(metadata))
            {
                // If we're past the expiration time then just timeout the connection
                metadata.Connection.Timeout();
            }
            else
            {
                // The connection is still alive so we need to keep it alive with a server side "ping".
                // This is for scenarios where networking hardware (proxies, loadbalancers) get in the way
                // of us handling timeout's or disconnects gracefully
                if (RaiseKeepAlive(metadata))
                {
                    Logger.LogDebug("KeepAlive(" + metadata.Connection.ConnectionId + ")");

                    // Ensure delegate continues to use the C# Compiler static delegate caching optimization.
                    metadata.Connection.KeepAlive().Catch((ex, state) => OnKeepAliveError(ex, state), state: Logger, logger: Logger);
                }

                MarkConnection(metadata.Connection);
            }
        }

        [SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "We're tracing exceptions and don't want to crash the process.")]
        private void CheckDisconnect(ConnectionMetadata metadata)
        {
            try
            {
                if (RaiseDisconnect(metadata))
                {
                    // Remove the connection from the list
                    RemoveConnection(metadata.Connection);

                    // Fire disconnect on the connection
                    metadata.Connection.Disconnect();
                }
            }
            catch (Exception ex)
            {
                // Swallow exceptions that might happen during disconnect
                Logger.LogError(String.Format("Raising Disconnect failed: {0}", ex));
            }
        }

        private bool RaiseDisconnect(ConnectionMetadata metadata)
        {
            // The transport is currently dead but it could just be reconnecting 
            // so we to check it's last active time to see if it's over the disconnect
            // threshold
            TimeSpan elapsed = DateTime.UtcNow - metadata.LastMarked;

            // The threshold for disconnect is the transport threshold + (potential network issues)
            var threshold = metadata.Connection.DisconnectThreshold + _transportOptions.DisconnectTimeout;

            return elapsed >= threshold;
        }

        private bool RaiseKeepAlive(ConnectionMetadata metadata)
        {
            var keepAlive = _transportOptions.KeepAlive;

            // Don't raise keep alive if it's set to 0 or the transport doesn't support
            // keep alive
            if (keepAlive == null || !metadata.Connection.SupportsKeepAlive)
            {
                return false;
            }

            // Raise keep alive if the keep alive value has passed
            return _heartbeatCount % (ulong)TransportOptionsExtensions.HeartBeatsPerKeepAlive == 0;
        }

        private bool RaiseTimeout(ConnectionMetadata metadata)
        {
            // The connection already timed out so do nothing
            if (metadata.Connection.IsTimedOut)
            {
                return false;
            }

            // If keep alives are enabled and the transport doesn't require timeouts,
            // i.e. anything but long-polling, don't ever timeout.
            var keepAlive = _transportOptions.KeepAlive;
            if (keepAlive != null && !metadata.Connection.RequiresTimeout)
            {
                return false;
            }

            TimeSpan elapsed = DateTime.UtcNow - metadata.Initial;

            // Only raise timeout if we're past the configured connection timeout.
            return elapsed >= _transportOptions.LongPolling.PollTimeout;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_timer != null)
                {
                    _timer.Dispose();
                }

                Logger.LogInformation("Dispose(). Closing all connections");

                // Kill all connections
                foreach (var pair in _connections)
                {
                    ConnectionMetadata metadata;
                    if (_connections.TryGetValue(pair.Key, out metadata))
                    {
                        metadata.Connection.End();
                    }
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }

        private static void OnKeepAliveError(AggregateException ex, object state)
        {
            ((ILogger)state).LogError("Failed to send keep alive: " + ex.GetBaseException());
        }

        private class ConnectionMetadata
        {
            public ConnectionMetadata(ITrackingConnection connection)
            {
                Connection = connection;
                Initial = DateTime.UtcNow;
                LastMarked = DateTime.UtcNow;
            }

            // The connection instance
            public ITrackingConnection Connection { get; set; }

            // The last time the connection had any activity
            public DateTime LastMarked { get; set; }

            // The initial connection time of the connection
            public DateTime Initial { get; set; }
        }
    }
}
