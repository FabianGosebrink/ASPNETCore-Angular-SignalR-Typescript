// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Microsoft.AspNetCore.SignalR.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    internal class HubRequestParser : IHubRequestParser
    {
        private static readonly IJsonValue[] _emptyArgs = new IJsonValue[0];

        public HubRequest Parse(string data, JsonSerializer serializer)
        {
            var deserializedData = serializer.Parse<HubInvocation>(data);

            var request = new HubRequest();

            request.Hub = deserializedData.Hub;
            request.Method = deserializedData.Method;
            request.Id = deserializedData.Id;
            request.ParameterValues = (deserializedData.Args != null) ? deserializedData.Args.Select(value => new JRawValue(value)).ToArray() : _emptyArgs;

            return request;
        }

        [SuppressMessage("Microsoft.Performance", "CA1812:AvoidUninstantiatedInternalClasses", Justification = "This type is used for deserialzation")]
        private class HubInvocation
        {
            [JsonProperty("H")]
            public string Hub { get; set; }
            [JsonProperty("M")]
            public string Method { get; set; }
            [JsonProperty("I")]
            public string Id { get; set; }
            [JsonProperty("A")]
            public JRaw[] Args { get; set; }
        }
    }
}
