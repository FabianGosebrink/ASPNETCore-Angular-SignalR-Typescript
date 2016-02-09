using System;
using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAngular2.Models
{
    public class ChatMessage
    {
        public string Message { get; set; }
        public DateTime Sent { get; set; }
    }
}
