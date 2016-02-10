// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using Microsoft.AspNet.Http;

namespace Microsoft.AspNet.SignalR.Infrastructure
{
    public class PrincipalUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HttpRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException("request");
            }

            var user = request.HttpContext.User;
            if (user != null && user.Identity != null)
            {
                return user.Identity.Name;
            }

            return null;
        }
    }
}
