// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.AspNetCore.SignalR.Transports;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class SignalRServiceCollectionExtensions
    {
        public static SignalRServicesBuilder AddSignalR(this IServiceCollection services)
        {
            return services.AddSignalR(configureOptions: null);
        }

        public static SignalRServicesBuilder AddSignalR(this IServiceCollection services, Action<SignalROptions> configureOptions)
        {
            // Dependencies
            services.AddOptions();
            services.AddDataProtection();
            services.AddMessageBus();

            // SignalR services
            services.TryAddSingleton<IMemoryPool, MemoryPool>();
            services.TryAddSingleton<ITransportManager, TransportManager>();
            services.TryAddSingleton<ITransportHeartbeat, TransportHeartbeat>();
            services.TryAddSingleton<IConnectionManager, ConnectionManager>();
            services.TryAddSingleton<IAckHandler, AckHandler>();
            services.TryAddSingleton<AckSubscriber, AckSubscriber>();
            services.TryAddSingleton<IAssemblyLocator, DefaultAssemblyLocator>();
            services.TryAddSingleton<IHubManager, DefaultHubManager>();
            services.TryAddSingleton<IMethodDescriptorProvider, ReflectedMethodDescriptorProvider>();
            services.TryAddSingleton<IHubDescriptorProvider, ReflectedHubDescriptorProvider>();
            services.TryAddSingleton<JsonSerializer, JsonSerializer>();
            services.TryAddSingleton<IUserIdProvider, PrincipalUserIdProvider>();
            services.TryAddSingleton<IParameterResolver, DefaultParameterResolver>();
            services.TryAddSingleton<IHubActivator, DefaultHubActivator>();
            services.TryAddSingleton<IJavaScriptProxyGenerator, DefaultJavaScriptProxyGenerator>();
            services.TryAddSingleton<IJavaScriptMinifier, NullJavaScriptMinifier>();
            services.TryAddSingleton<IHubRequestParser, HubRequestParser>();
            services.TryAddSingleton<IHubPipelineInvoker, HubPipeline>();

            services.TryAddSingleton(typeof(IPersistentConnectionContext<>), typeof(PersistentConnectionContextService<>));
            services.TryAddSingleton(typeof(IHubContext<>), typeof(HubContextService<>));
            services.TryAddSingleton(typeof(IHubContext<,>), typeof(HubContextService<,>));

            //allows detecting if services were registered
            services.TryAddSingleton<SignalRMarkerService, SignalRMarkerService>();

            // TODO: Just use the new IDataProtectionProvider abstraction directly here
            services.TryAddSingleton<IProtectedData, DataProtectionProviderProtectedData>();

            // Setup the default SignalR options
            services.TryAddTransient<IConfigureOptions<SignalROptions>, SignalROptionsSetup>();

            if (configureOptions != null)
            {
                services.Configure(configureOptions);
            }

            return new SignalRServicesBuilder(services);
        }
    }
}
