// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;

namespace Microsoft.AspNet.SignalR.Infrastructure
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public sealed class PerformanceCounterAttribute : Attribute
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public PerformanceCounterType CounterType { get; set; }
    }

    public enum PerformanceCounterType
    {
        NumberOfItems32,
        NumberOfItems64,
        RateOfCountsPerSecond32,
        RateOfCountsPerSecond64
    }
}
