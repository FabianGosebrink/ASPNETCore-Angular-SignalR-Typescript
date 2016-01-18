using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace AspNet5Angular2Demo.Hubs
{

    [HubName("coolmessages")]
    public class CoolMessagesHub : Hub
    {
        public void FoodAdded()
        {
            Clients.All.FoodAdded();
        }

        public void FoodDeleted()
        {
            Clients.All.FoodDeleted();
        }

        public void AddMessage(string message)
        {
            Clients.All.AddMessage(message);
        }
    }
}
