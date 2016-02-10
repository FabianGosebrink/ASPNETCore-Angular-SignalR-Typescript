// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Microsoft.AspNet.SignalR.Hubs
{
    public static class ReflectionHelper
    {
        private static readonly Type[] _excludeTypes = new[] { typeof(Hub), typeof(object) };
        private static readonly Type[] _excludeInterfaces = new[] { typeof(IHub), typeof(IDisposable) };

        public static IEnumerable<MethodInfo> GetExportedHubMethods(Type type)
        {
            if (!typeof(IHub).IsAssignableFrom(type))
            {
                return Enumerable.Empty<MethodInfo>();
            }

            var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance);
            var allInterfaceMethods = _excludeInterfaces.SelectMany(i => GetInterfaceMethods(type, i));

            return methods.Except(allInterfaceMethods).Where(IsValidHubMethod);

        }

        private static bool IsValidHubMethod(MethodInfo methodInfo)
        {
            return !(_excludeTypes.Contains(methodInfo.GetBaseDefinition().DeclaringType) ||
                     methodInfo.IsSpecialName);
        }

        private static IEnumerable<MethodInfo> GetInterfaceMethods(Type type, Type iface)
        {
            if (!iface.IsAssignableFrom(type))
            {
                return Enumerable.Empty<MethodInfo>();
            }

            return type.GetTypeInfo().GetRuntimeInterfaceMap(iface).TargetMethods;
        }

        public static TResult GetAttributeValue<TAttribute, TResult>(MethodInfo methodInfo, Func<TAttribute, TResult> valueGetter)
            where TAttribute : Attribute
        {
            return GetAttributeValue<TAttribute, TResult>(() => methodInfo.GetCustomAttribute<TAttribute>(), valueGetter);
        }

        public static TResult GetAttributeValue<TAttribute, TResult>(TypeInfo source, Func<TAttribute, TResult> valueGetter)
            where TAttribute : Attribute
        {
            return GetAttributeValue<TAttribute, TResult>(() => source.GetCustomAttribute<TAttribute>(), valueGetter);
        }

        public static TResult GetAttributeValue<TAttribute, TResult>(Func<TAttribute> attributeProvider, Func<TAttribute, TResult> valueGetter)
            where TAttribute : Attribute
        {
            if (attributeProvider == null)
            {
                throw new ArgumentNullException("attributeProvider");
            }

            if (valueGetter == null)
            {
                throw new ArgumentNullException("valueGetter");
            }

            var attribute = attributeProvider();

            if (attribute != null)
            {
                return valueGetter(attribute);
            }

            return default(TResult);
        }
    }
}
