// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.SignalR.Json;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    public class HubRequest
    {
        public string Hub { get; set; }
        public string Method { get; set; }
        [SuppressMessage("Microsoft.Performance", "CA1819:PropertiesShouldNotReturnArrays", Justification = "This type is used for de-serialization.")]
        public IJsonValue[] ParameterValues { get; set; }
        public string Id { get; set; }
    }
}
