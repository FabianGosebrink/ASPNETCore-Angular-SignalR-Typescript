// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;

namespace Microsoft.AspNet.SignalR.Configuration
{
    internal static class TransportOptionsExtensions
    {
        public const int MissedTimeoutsBeforeClientReconnect = 2;
        public const int HeartBeatsPerKeepAlive = 2;
        public const int HeartBeatsPerDisconnectTimeout = 6;

        /// <summary>
        /// The amount of time the client should wait without seeing a keep alive before trying to reconnect.
        /// </summary>
        public static TimeSpan? KeepAliveTimeout(this TransportOptions options)
        {
            if (options.KeepAlive != null)
            {
                return TimeSpan.FromTicks(options.KeepAlive.Value.Ticks * MissedTimeoutsBeforeClientReconnect);
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// The interval between successively checking connection states.
        /// </summary>
        public static TimeSpan HeartbeatInterval(this TransportOptions options)
        {
            if (options.KeepAlive != null)
            {
                return TimeSpan.FromTicks(options.KeepAlive.Value.Ticks / HeartBeatsPerKeepAlive);
            }
            else
            {
                // If KeepAlives are disabled, have the heartbeat run at the same rate it would if the KeepAlive was
                // kept at the default value.
                return TimeSpan.FromTicks(options.DisconnectTimeout.Ticks / HeartBeatsPerDisconnectTimeout);
            }
        }

        /// <summary>
        /// The amount of time a Topic should stay in memory after its last subscriber is removed.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public static TimeSpan TopicTtl(this TransportOptions options)
        {
            // If the deep-alive is disabled, don't take it into account when calculating the topic TTL.
            var keepAliveTimeout = options.KeepAliveTimeout() ?? TimeSpan.Zero;

            // Keep topics alive for twice as long as we let connections to reconnect. (The DisconnectTimeout)
            // Also add twice the keep-alive timeout since clients might take a while to notice they are disconnected.
            // This should be a very conservative estimate for how long we must wait before considering a topic dead.
            return TimeSpan.FromTicks((options.DisconnectTimeout.Ticks + keepAliveTimeout.Ticks) * 2);
        }
    }
}
