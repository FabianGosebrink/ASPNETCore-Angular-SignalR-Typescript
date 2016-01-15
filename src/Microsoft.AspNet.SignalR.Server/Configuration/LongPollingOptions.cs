// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;

namespace Microsoft.AspNet.SignalR.Configuration
{
    public class LongPollingOptions
    {
        public LongPollingOptions()
        {
            PollDelay = TimeSpan.Zero;
            PollTimeout = TimeSpan.FromSeconds(110);
        }

        /// <summary>
        /// Gets or sets a <see cref="TimeSpan"/> representing tell the client to wait before restablishing a
        /// long poll connection after data is sent from the server. 
        /// The default value is 0.
        /// </summary>
        public TimeSpan PollDelay { get; set; }

        /// <summary>
        /// Gets or sets a <see cref="TimeSpan"/> representing the amount of time to leave a long poll request open
        /// without receiving any messages before timing out.
        /// The default value is 110 seconds.
        /// </summary>
        public TimeSpan PollTimeout { get; set; }
    }
}