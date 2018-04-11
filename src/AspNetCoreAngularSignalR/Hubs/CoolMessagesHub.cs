using System.Threading.Tasks;
using AspNetCoreAngularSignalR.Models;
using Microsoft.AspNetCore.SignalR;

namespace AspNetCoreAngularSignalR.Hubs
{
    public class CoolMessagesHub : Hub
    {
        public Task SendMessage(ChatMessage chatMessage)
        {
            return Clients.All.SendAsync("Send", chatMessage);
        }
    }
}
