using System;
using Microsoft.AspNet.Http;

namespace Microsoft.AspNet.SignalR
{
    internal static class RequestExtensions
    {
        public static string LocalPath(this HttpRequest request)
        {
            return request.PathBase.Value + request.Path.Value;
        }
    }
}