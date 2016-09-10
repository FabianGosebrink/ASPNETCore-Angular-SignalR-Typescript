// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Microsoft.AspNetCore.SignalR.Hosting
{
    public class PersistentConnectionMiddleware
    {
        private readonly Type _connectionType;
        private readonly IOptions<SignalROptions> _optionsAccessor;
        private readonly RequestDelegate _next;
        private readonly IServiceProvider _serviceProvider;

        public PersistentConnectionMiddleware(RequestDelegate next,
                                              Type connectionType,
                                              IOptions<SignalROptions> optionsAccessor,
                                              IServiceProvider serviceProvider)
        {
            _next = next;
            _serviceProvider = serviceProvider;
            _connectionType = connectionType;
            _optionsAccessor = optionsAccessor;
        }

        public Task Invoke(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if (JsonUtility.TryRejectJSONPRequest(_optionsAccessor.Value, context))
            {
                return TaskAsyncHelper.Empty;
            }

            var connection = ActivatorUtilities.CreateInstance(_serviceProvider, _connectionType) as PersistentConnection;

            connection.Initialize(_serviceProvider);

            return connection.ProcessRequest(context);
        }
    }
}
