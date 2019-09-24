using System;

namespace AspNetCoreAngularSignalR.Models
{
    public class ChatMessage
    {
        public string Message { get; set; }
        public DateTime Sent { get; set; }
    }
}
