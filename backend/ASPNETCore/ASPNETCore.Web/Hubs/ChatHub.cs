using System.Threading.Tasks;
using AspNetCoreAngularSignalR.Models;
using Microsoft.AspNetCore.SignalR;

namespace AspNetCoreAngularSignalR.Hubs
{
    public class ChatHub : Hub
    {
        public Task SendMessage(ChatMessage chatMessage)
        {
            return Clients.All.SendAsync("Send", chatMessage);
        }
    }
}
