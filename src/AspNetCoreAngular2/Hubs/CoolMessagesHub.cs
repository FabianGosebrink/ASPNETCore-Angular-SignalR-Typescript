using AspNetCoreAngular2.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace AspNetCoreAngular2.Hubs
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
