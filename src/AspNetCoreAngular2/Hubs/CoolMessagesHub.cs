using ASPNETCoreAngular2Demo.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;

namespace ASPNETCoreAngular2Demo.Hubs
{
    [HubName("coolmessages")]
    public class CoolMessagesHub : Hub
    {
        public void SendMessage(ChatMessage chatMessage)
        {
            Clients.All.SendMessage(chatMessage);
        }
    }
}
