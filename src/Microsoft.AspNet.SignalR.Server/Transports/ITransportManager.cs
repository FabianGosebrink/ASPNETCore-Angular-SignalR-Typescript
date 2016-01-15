// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using Microsoft.AspNet.Http;
namespace Microsoft.AspNet.SignalR.Transports
{
    /// <summary>
    /// Manages the transports for connections.
    /// </summary>
    public interface ITransportManager
    {
        /// <summary>
        /// Gets the specified transport for the specified <see cref="HttpContext"/>.
        /// </summary>
        /// <param name="context">The <see cref="HttpContext"/> for the current request.</param>
        /// <returns>The <see cref="ITransport"/> for the specified <see cref="HttpContext"/>.</returns>
        ITransport GetTransport(HttpContext context);
        
        /// <summary>
        /// Determines whether the specified transport is supported.
        /// </summary>
        /// <param name="transportName">The name of the transport to test.</param>
        /// <returns>True if the transport is supported, otherwise False.</returns>
        bool SupportsTransport(string transportName);
    }
}
