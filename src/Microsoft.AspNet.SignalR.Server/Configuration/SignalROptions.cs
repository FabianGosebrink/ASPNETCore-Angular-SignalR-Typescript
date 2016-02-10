// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNet.SignalR.Configuration;

namespace Microsoft.AspNet.SignalR
{
    /// <summary>
    /// Provides access to server configuration.
    /// </summary>
    public class SignalROptions
    {
        public SignalROptions()
        {
            Hubs = new HubOptions();
            MessageBus = new MessageBusOptions();
            Transports = new TransportOptions();
        }

        /// <summary>
        /// Gets or sets a boolean that determines if JSONP is enabled.
        /// </summary>
        [SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "JSONP", Justification = "JSONP is a known technology")]
        public bool EnableJSONP { get; set; }

        /// <summary>
        /// Gets or sets Hub related configuration.
        /// </summary>
        public HubOptions Hubs { get; set; }

        /// <summary>
        /// Gets or sets message bus related configuration.
        /// </summary>
        public MessageBusOptions MessageBus { get; set; }

        /// <summary>
        /// Gets or sets transport related configuration.
        /// </summary>
        public TransportOptions Transports { get; set; }
    }
}