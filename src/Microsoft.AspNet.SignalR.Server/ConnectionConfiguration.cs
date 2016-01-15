// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Diagnostics.CodeAnalysis;

namespace Microsoft.AspNet.SignalR
{
    public class ConnectionConfiguration
    {
        /// <summary>
        /// Gets of sets a boolean that determines if JSONP is enabled.
        /// </summary>
        [SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "JSONP", Justification = "JSONP is a known technology")]
        public bool EnableJSONP
        {
            get;
            set;
        }
    }
}
