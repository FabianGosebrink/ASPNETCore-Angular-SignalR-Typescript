using ASPNET5Angular2.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace ASPNET5Angular2.Hubs
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
