using System.Threading.Tasks;
using AspNetCoreAngularSignalR.Models;
using Microsoft.AspNetCore.SignalR;

namespace AspNetCoreAngularSignalR.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(ChatMessage chatMessage)
        {
            await Clients.All.SendAsync("Send", chatMessage);
        }
    }
}
