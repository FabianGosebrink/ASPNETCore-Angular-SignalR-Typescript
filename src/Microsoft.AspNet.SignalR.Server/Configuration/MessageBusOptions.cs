// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

namespace Microsoft.AspNet.SignalR.Configuration
{
    public class MessageBusOptions
    {
        public MessageBusOptions()
        {
            MessageBufferSize = 1000;
            MaxTopicsWithNoSubscriptions = 1000;
        }

        /// <summary>
        /// Gets or sets the number of messages to buffer for a specific signal.
        /// The default value is 1000.
        /// </summary>
        public int MessageBufferSize { get; set; }

        /// <summary>
        /// Gets or sets the number of topics to allow with no subscriptions
        /// </summary>
        public int MaxTopicsWithNoSubscriptions { get; set; }
    }
}