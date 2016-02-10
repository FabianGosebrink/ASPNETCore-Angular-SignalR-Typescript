// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;
using Microsoft.AspNet.SignalR.Hubs;

namespace Microsoft.AspNet.SignalR
{
    public class HubOptions
    {
        /// <summary>
        /// Determines whether JavaScript proxies for the server-side hubs should be auto generated at {Path}/hubs or {Path}/js.
        /// Defaults to true.
        /// </summary>
        public bool EnableJavaScriptProxies { get; set; }

        /// <summary>
        /// Determines whether detailed exceptions thrown in Hub methods get reported back the invoking client.
        /// Defaults to false.
        /// </summary>
        public bool EnableDetailedErrors { get; set; }

        public List<IHubPipelineModule> PipelineModules { get; } = new List<IHubPipelineModule>();

        public HubOptions()
        {
            EnableJavaScriptProxies = true;
        }
    }
}
