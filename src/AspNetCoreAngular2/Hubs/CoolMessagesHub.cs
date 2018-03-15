using ASPNETCoreAngular2Demo.Models;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ASPNETCoreAngular2Demo.Hubs
{
    public class CoolMessagesHub : Hub
    {
        public Task SendMessage(ChatMessage chatMessage)
        {
            return Clients.All.SendAsync("Send", chatMessage);
        }
    }
}
