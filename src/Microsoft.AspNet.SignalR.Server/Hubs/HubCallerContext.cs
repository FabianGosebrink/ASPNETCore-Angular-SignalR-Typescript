// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System.Security.Principal;
using Microsoft.AspNet.Http;

namespace Microsoft.AspNet.SignalR.Hubs
{
    public class HubCallerContext
    {
        /// <summary>
        /// Gets the connection id of the calling client.
        /// </summary>
        public virtual string ConnectionId { get; private set; }

        /// <summary>
        /// Gets the cookies for the request.
        /// </summary>
        public virtual IReadableStringCollection RequestCookies
        {
            get
            {
                return Request.Cookies;
            }
        }

        /// <summary>
        /// Gets the headers for the request.
        /// </summary>
        public virtual IHeaderDictionary Headers
        {
            get
            {
                return Request.Headers;
            }
        }

        /// <summary>
        /// Gets the querystring for the request.
        /// </summary>
        public virtual IReadableStringCollection QueryString
        {
            get
            {
                return Request.Query;
            }
        }

        /// <summary>
        /// Gets the <see cref="IPrincipal"/> for the request.
        /// </summary>
        public virtual IPrincipal User
        {
            get
            {
                return Request.HttpContext.User;
            }
        }

        /// <summary>
        /// Gets the <see cref="HttpRequest"/> for the current HTTP request.
        /// </summary>
        public virtual HttpRequest Request { get; private set; }

        /// <summary>
        /// This constructor is only intended to enable mocking of the class. Use of this constructor 
        /// for other purposes may result in unexpected behavior.   
        /// </summary>
        protected HubCallerContext() { }

        public HubCallerContext(HttpRequest request, string connectionId)
        {
            ConnectionId = connectionId;
            Request = request;
        }
    }
}
