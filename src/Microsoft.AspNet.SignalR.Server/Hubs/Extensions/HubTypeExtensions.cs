// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Reflection;

namespace Microsoft.AspNet.SignalR.Hubs
{
    internal static class HubTypeExtensions
    {
        internal static string GetHubName(this Type type)
        {
            if (!typeof(IHub).GetTypeInfo().IsAssignableFrom(type.GetTypeInfo()))
            {
                return null;
            }

            return GetHubAttributeName(type) ?? GetHubTypeName(type);
        }

        internal static string GetHubAttributeName(this Type type)
        {
            if (!typeof(IHub).GetTypeInfo().IsAssignableFrom(type.GetTypeInfo()))
            {
                return null;
            }

            // We can still return null if there is no attribute name
            return ReflectionHelper.GetAttributeValue<HubNameAttribute, string>(type.GetTypeInfo(), attr => attr.HubName);
        }

        private static string GetHubTypeName(Type type)
        {
            var lastIndexOfBacktick = type.Name.LastIndexOf('`');
            if (lastIndexOfBacktick == -1)
            {
                return type.Name;
            }
            else
            {
                return type.Name.Substring(0, lastIndexOfBacktick);
            }
        }
    }
}
