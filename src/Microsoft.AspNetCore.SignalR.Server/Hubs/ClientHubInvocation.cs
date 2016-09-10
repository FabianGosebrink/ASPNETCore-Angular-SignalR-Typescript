// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Newtonsoft.Json;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    /// <summary>
    /// A description of a client-side hub method invocation.
    /// </summary>
    public class ClientHubInvocation
    {
        /// <summary>
        /// The name of the hub that the method being invoked belongs to.
        /// </summary>
        [JsonProperty("H")]
        public string Hub { get; set; }

        /// <summary>
        /// The name of the client-side hub method be invoked.
        /// </summary>
        [JsonProperty("M")]
        public string Method { get; set; }

        /// <summary>
        /// The argument list the client-side hub method will be called with.
        /// </summary>
        [SuppressMessage("Microsoft.Performance", "CA1819:PropertiesShouldNotReturnArrays", Justification = "Type is used for serialization.")]
        [JsonProperty("A")]
        public object[] Args { get; set; }
    }
}
