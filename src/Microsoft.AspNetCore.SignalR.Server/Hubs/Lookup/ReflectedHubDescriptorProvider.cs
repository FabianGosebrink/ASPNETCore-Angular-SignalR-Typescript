// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Microsoft.AspNetCore.SignalR.Hubs
{
    public class ReflectedHubDescriptorProvider : IHubDescriptorProvider
    {
        private readonly Lazy<IDictionary<string, HubDescriptor>> _hubs;
        private readonly IAssemblyLocator _locator;
        private readonly ILogger _logger;

        public ReflectedHubDescriptorProvider(IAssemblyLocator locator, ILoggerFactory loggerFactory)
        {
            _locator = locator;
            _hubs = new Lazy<IDictionary<string, HubDescriptor>>(BuildHubsCache);
            _logger = loggerFactory.CreateLogger<ReflectedHubDescriptorProvider>();
        }

        public IList<HubDescriptor> GetHubs()
        {
            return _hubs.Value
                .Select(kv => kv.Value)
                .Distinct()
                .ToList();
        }

        public bool TryGetHub(string hubName, out HubDescriptor descriptor)
        {
            return _hubs.Value.TryGetValue(hubName, out descriptor);
        }

        protected IDictionary<string, HubDescriptor> BuildHubsCache()
        {
            // Getting all IHub-implementing types that apply
            var types = _locator.GetAssemblies()
                                .SelectMany(GetTypesSafe)
                                .Where(IsHubType);

            // Building cache entries for each descriptor
            // Each descriptor is stored in dictionary under a key
            // that is it's name or the name provided by an attribute
            var hubDescriptors = types
                .Select(type => new HubDescriptor
                                {
                                    NameSpecified = (type.GetHubAttributeName() != null),
                                    Name = type.GetHubName(),
                                    HubType = type
                                });

            var cacheEntries = new Dictionary<string, HubDescriptor>(StringComparer.OrdinalIgnoreCase);

            foreach (var descriptor in hubDescriptors)
            {
                HubDescriptor oldDescriptor = null;
                if (!cacheEntries.TryGetValue(descriptor.Name, out oldDescriptor))
                {
                    cacheEntries[descriptor.Name] = descriptor;
                }
                else
                {
                    throw new InvalidOperationException(
                        String.Format(CultureInfo.CurrentCulture,
                            Resources.Error_DuplicateHubNames,
                            oldDescriptor.HubType.AssemblyQualifiedName,
                            descriptor.HubType.AssemblyQualifiedName,
                            descriptor.Name));
                }
            }

            return cacheEntries;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "If we throw then it's not a hub type")]
        private static bool IsHubType(Type type)
        {
            try
            {
                return typeof(IHub).IsAssignableFrom(type) &&
                       !type.GetTypeInfo().IsAbstract &&
                       (type.GetTypeInfo().Attributes.HasFlag(TypeAttributes.Public) ||
                        type.GetTypeInfo().Attributes.HasFlag(TypeAttributes.NestedPublic));
            }
            catch
            {
                return false;
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "If we throw then we have an empty type")]
        private IEnumerable<Type> GetTypesSafe(Assembly a)
        {
            try
            {
                return a.GetTypes();
            }
            catch (ReflectionTypeLoadException ex)
            {
                _logger.LogWarning(
                    "Some of the classes from assembly \"{0}\" could Not be loaded when searching for Hubs. [{1}]" + Environment.NewLine +
                    "Original exception type: {2}" + Environment.NewLine +
                    "Original exception message: {3}" + Environment.NewLine,
                    a.FullName,
#if NET451
                    a.Location,
#else
                    null,
#endif
                    ex.GetType().Name,
                    ex.Message);

                if (ex.LoaderExceptions != null)
                {
                    _logger.LogWarning("Loader exceptions messages: ");

                    foreach (var exception in ex.LoaderExceptions)
                    {
                        _logger.LogWarning("{0}" + Environment.NewLine, exception);
                    }
                }

                return ex.Types.Where(t => t != null);
            }
            catch (Exception ex)
            {
                // REVIEW: Figure out how to disabiguate here
                _logger.LogWarning("None of the classes from assembly \"{0}\" could be loaded when searching for Hubs. [{1}]\r\n" +
                                     "Original exception type: {2}\r\n" +
                                     "Original exception message: {3}\r\n",
                                     a.FullName,
#if NET451
                                     a.Location,
#else
                                     null,
#endif
                                     ex.GetType().Name,
                                     ex.Message);

                return Enumerable.Empty<Type>();
            }
        }
    }
}
