// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using Microsoft.AspNet.Http;

namespace Microsoft.AspNet.SignalR.Hubs
{
    /// <summary>
    /// Interface to be implemented by <see cref="System.Attribute"/>s that can authorize client to connect to a <see cref="IHub"/>.
    /// </summary>
    public interface IAuthorizeHubConnection
    {
        /// <summary>
        /// Given a <see cref="HubCallerContext"/>, determine whether client is authorized to connect to <see cref="IHub"/>.
        /// </summary>
        /// <param name="hubDescriptor">Description of the hub client is attempting to connect to.</param>
        /// <param name="">The connect request made by the client.</param>
        /// <returns>true if the caller is authorized to connect to the hub; otherwise, false.</returns>
        bool AuthorizeHubConnection(HubDescriptor hubDescriptor, HttpRequest request);
    }
}
