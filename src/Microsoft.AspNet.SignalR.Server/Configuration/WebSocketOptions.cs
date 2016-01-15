// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

namespace Microsoft.AspNet.SignalR.Configuration
{
    public class WebSocketOptions
    {
        public WebSocketOptions()
        {
            MaxIncomingMessageSize = 64 * 1024; // 64 KB
        }

        /// <summary>
        /// Gets or sets the maximum size in bytes of messages sent from client to the server via WebSockets.
        /// Set to null to disable this limit.
        /// The default value is 65536 or 64 KB.
        /// </summary>
        public int? MaxIncomingMessageSize { get; set; }
    }
}