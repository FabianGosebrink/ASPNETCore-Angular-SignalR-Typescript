using System;
using Microsoft.AspNetCore.Http;

namespace Microsoft.AspNetCore.SignalR
{
    internal static class RequestExtensions
    {
        public static string LocalPath(this HttpRequest request)
        {
            return request.PathBase.Value + request.Path.Value;
        }
    }
}