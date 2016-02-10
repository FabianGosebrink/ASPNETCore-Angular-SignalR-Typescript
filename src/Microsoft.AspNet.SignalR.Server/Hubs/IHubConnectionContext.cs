// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Collections.Generic;

namespace Microsoft.AspNet.SignalR.Hubs
{
    /// <summary>
    /// Encapsulates all information about a SignalR connection for an <see cref="IHub"/>.
    /// </summary>
    public interface IHubConnectionContext<TClient> where TClient : class
    {
        TClient All { get; }
        TClient AllExcept(params string[] excludeConnectionIds);

        TClient Client(string connectionId);
        TClient Clients(IList<string> connectionIds);

        TClient Group(string groupName, params string[] excludeConnectionIds);
        TClient Groups(IList<string> groupNames, params string[] excludeConnectionIds);

        TClient User(string userId);

        TClient Users(IList<string> userIds);
    }
}
