// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using Microsoft.AspNet.SignalR.Infrastructure;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class MessageBusServiceCollectionExtensions
    {
        public static IServiceCollection AddMessageBus(this IServiceCollection services)
        {
            // Dependencies
            services.AddOptions();

            // SignalR services
            services.TryAdd(ServiceDescriptor.Singleton<IMessageBus, MessageBus>());
            services.TryAdd(ServiceDescriptor.Singleton<IStringMinifier, StringMinifier>());
            services.TryAdd(ServiceDescriptor.Singleton<IPerformanceCounterManager, PerformanceCounterManager>());

            return services;
        }
    }
}
