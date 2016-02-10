// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR.Infrastructure;
using Microsoft.AspNet.SignalR.Transports;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.OptionsModel;
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
            services.TryAdd(ServiceDescriptor.Singleton<IMemoryPool, MemoryPool>());
            services.TryAdd(ServiceDescriptor.Singleton<ITransportManager, TransportManager>());
            services.TryAdd(ServiceDescriptor.Singleton<ITransportHeartbeat, TransportHeartbeat>());
            services.TryAdd(ServiceDescriptor.Singleton<IConnectionManager, ConnectionManager>());
            services.TryAdd(ServiceDescriptor.Singleton<IAckHandler, AckHandler>());
            services.TryAdd(ServiceDescriptor.Singleton<AckSubscriber, AckSubscriber>());
            services.TryAdd(ServiceDescriptor.Singleton<IAssemblyLocator, DefaultAssemblyLocator>());
            services.TryAdd(ServiceDescriptor.Singleton<IHubManager, DefaultHubManager>());
            services.TryAdd(ServiceDescriptor.Singleton<IMethodDescriptorProvider, ReflectedMethodDescriptorProvider>());
            services.TryAdd(ServiceDescriptor.Singleton<IHubDescriptorProvider, ReflectedHubDescriptorProvider>());
            services.TryAdd(ServiceDescriptor.Singleton<JsonSerializer, JsonSerializer>());
            services.TryAdd(ServiceDescriptor.Singleton<IUserIdProvider, PrincipalUserIdProvider>());
            services.TryAdd(ServiceDescriptor.Singleton<IParameterResolver, DefaultParameterResolver>());
            services.TryAdd(ServiceDescriptor.Singleton<IHubActivator, DefaultHubActivator>());
            services.TryAdd(ServiceDescriptor.Singleton<IJavaScriptProxyGenerator, DefaultJavaScriptProxyGenerator>());
            services.TryAdd(ServiceDescriptor.Singleton<IJavaScriptMinifier, NullJavaScriptMinifier>());
            services.TryAdd(ServiceDescriptor.Singleton<IHubRequestParser, HubRequestParser>());
            services.TryAdd(ServiceDescriptor.Singleton<IHubPipelineInvoker, HubPipeline>());

            services.TryAdd(ServiceDescriptor.Singleton(typeof(IPersistentConnectionContext<>), typeof(PersistentConnectionContextService<>)));
            services.TryAdd(ServiceDescriptor.Singleton(typeof(IHubContext<>), typeof(HubContextService<>)));
            services.TryAdd(ServiceDescriptor.Singleton(typeof(IHubContext<,>), typeof(HubContextService<,>)));

            // TODO: Just use the new IDataProtectionProvider abstraction directly here
            services.TryAdd(ServiceDescriptor.Singleton<IProtectedData, DataProtectionProviderProtectedData>());

            // Setup the default SignalR options
            services.TryAdd(ServiceDescriptor.Transient<IConfigureOptions<SignalROptions>, SignalROptionsSetup>());

            if (configureOptions != null)
            {
                services.Configure(configureOptions);
            }

            return new SignalRServicesBuilder(services);
        }        
    }
}
