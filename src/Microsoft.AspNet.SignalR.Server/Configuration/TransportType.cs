// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;

namespace Microsoft.AspNet.SignalR
{
    [Flags]
    public enum TransportType
    {
        /// <summary>
        /// Every transport
        /// </summary>
        All = Streaming | LongPolling,

        /// <summary>
        /// All transports except for long-polling
        /// </summary>
        Streaming = WebSockets | ServerSentEvents | ForeverFrame,

        WebSockets = 1,
        ServerSentEvents = 2,
        ForeverFrame = 4,
        LongPolling = 8
    }
}