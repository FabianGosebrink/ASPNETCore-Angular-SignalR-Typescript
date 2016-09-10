using System;

namespace Microsoft.AspNetCore.SignalR.Messaging
{
    public class MessageBusOptions
    {
        public int MaxTopicsWithNoSubscriptions { get; set; }
        public int MessageBufferSize { get; set; }
        public TimeSpan TopicTTL { get; set; }

        public MessageBusOptions()
        {
            MessageBufferSize = 1000;
            MaxTopicsWithNoSubscriptions = 1000;
        }
    }
}