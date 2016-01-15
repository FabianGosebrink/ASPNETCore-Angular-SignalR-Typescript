// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;

namespace Microsoft.AspNet.SignalR.Configuration
{
    public class TransportOptions
    {
        // The below effectively sets the minimum heartbeat to once per second.
        // if _minimumKeepAlive != 2 seconds, update the ArguementOutOfRanceExceptionMessage below
        private static readonly TimeSpan _minimumKeepAlive = TimeSpan.FromSeconds(2);

        // if _minimumKeepAlivesPerDisconnectTimeout != 3, update the ArguementOutOfRanceExceptionMessage below
        private const int _minimumKeepAlivesPerDisconnectTimeout = 3;

        // if _minimumDisconnectTimeout != 6 seconds, update the ArguementOutOfRanceExceptionMessage below
        private static readonly TimeSpan _minimumDisconnectTimeout = TimeSpan.FromTicks(_minimumKeepAlive.Ticks * _minimumKeepAlivesPerDisconnectTimeout);

        private bool _keepAliveConfigured;
        private TimeSpan? _keepAlive;
        private TimeSpan _disconnectTimeout;

        public TransportOptions()
        {
            EnabledTransports = TransportType.All;
            TransportConnectTimeout = TimeSpan.FromSeconds(5);
            DisconnectTimeout = TimeSpan.FromSeconds(30);
            WebSockets = new WebSocketOptions();
            LongPolling = new LongPollingOptions();
        }

        /// <summary>
        /// Gets or sets the enabled transports.
        /// The default value is <see cref="TransportType.All"/>.
        public TransportType EnabledTransports { get; set; }

        /// <summary>
        /// Gets or sets a <see cref="TimeSpan"/> representing the amount of time a client should allow to connect before falling
        /// back to another transport or failing.
        /// The default value is 5 seconds.
        /// </summary>
        public TimeSpan TransportConnectTimeout { get; set; }

        /// <summary>
        /// Gets or sets a <see cref="TimeSpan"/> representing the amount of time to wait after a connection goes away before raising the disconnect event.
        /// The default value is 30 seconds.
        /// </summary>
        public TimeSpan DisconnectTimeout
        {
            get
            {
                return _disconnectTimeout;
            }
            set
            {
                if (value < _minimumDisconnectTimeout)
                {
                    throw new ArgumentOutOfRangeException("value", Resources.Error_DisconnectTimeoutMustBeAtLeastSixSeconds);
                }

                if (_keepAliveConfigured)
                {
                    throw new InvalidOperationException(Resources.Error_DisconnectTimeoutCannotBeConfiguredAfterKeepAlive);
                }

                _disconnectTimeout = value;
                _keepAlive = TimeSpan.FromTicks(_disconnectTimeout.Ticks / _minimumKeepAlivesPerDisconnectTimeout);
            }
        }

        /// <summary>
        /// Gets or sets a <see cref="TimeSpan"/> representing the amount of time between sending keep alive messages.
        /// If enabled, this value must be at least two seconds. Set to null to disable.
        /// The default value is 10 seconds.
        /// </summary>
        public TimeSpan? KeepAlive
        {
            get
            {
                return _keepAlive;
            }
            set
            {
                if (value < _minimumKeepAlive)
                {
                    throw new ArgumentOutOfRangeException("value", Resources.Error_KeepAliveMustBeGreaterThanTwoSeconds);
                }

                if (value > TimeSpan.FromTicks(_disconnectTimeout.Ticks / _minimumKeepAlivesPerDisconnectTimeout))
                {
                    throw new ArgumentOutOfRangeException("value", Resources.Error_KeepAliveMustBeNoMoreThanAThirdOfTheDisconnectTimeout);
                }

                _keepAlive = value;
                _keepAliveConfigured = true;
            }
        }

        /// <summary>
        /// Gets or sets WebSocket specific configuration.
        /// </summary>
        public WebSocketOptions WebSockets { get; set; }

        /// <summary>
        /// Gets or sets long-polling specific configuration.
        /// </summary>
        /// <returns></returns>
        public LongPollingOptions LongPolling { get; set; }
    }
}