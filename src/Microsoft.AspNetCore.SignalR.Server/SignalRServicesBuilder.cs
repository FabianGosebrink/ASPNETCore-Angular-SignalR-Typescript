// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;

namespace Microsoft.Extensions.DependencyInjection
{
    public class SignalRServicesBuilder
    {
        private readonly IServiceCollection _serviceCollection;

        public SignalRServicesBuilder(IServiceCollection serviceCollection)
        {
            if (serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }

            _serviceCollection = serviceCollection;
        }

        public virtual IServiceCollection ServiceCollection
        {
            get { return _serviceCollection; }
        }
    }
}