// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace Microsoft.AspNet.SignalR.Messaging
{
    public static class MessageBusExtensions
    {
        internal static Task Ack(this IMessageBus bus, string acker, string commandId)
        {
            // Prepare the ack
            var message = new Message(acker, AckSubscriber.Signal, null);
            message.CommandId = commandId;
            message.IsAck = true;
            return bus.Publish(message);
        }
    }
}
