using System;
using System.ComponentModel.DataAnnotations;

namespace ASPNET5Angular2.Models
{
    public class ChatMessage
    {
        public string Message { get; set; }
        public DateTime Sent { get; set; }
    }
}
