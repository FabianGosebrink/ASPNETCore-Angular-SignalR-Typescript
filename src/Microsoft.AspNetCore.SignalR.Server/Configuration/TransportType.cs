// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;

namespace Microsoft.AspNetCore.SignalR
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
        Streaming = WebSockets | ServerSentEvents,

        WebSockets = 1,
        ServerSentEvents = 2,
        LongPolling = 4
    }
}