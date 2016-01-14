namespace AspNet5Angular2Demo.Hubs
{
    using System.Threading.Tasks;

    using Microsoft.AspNet.SignalR;
    using Microsoft.AspNet.SignalR.Hubs;

    [HubName("coolmessages")]
    public class CoolMessagesHub  : Hub
    {
        public void Heartbeat()
        {
            Clients.All.Heartbeat();
        }

        public void AddMessage(string message)
        {
            Clients.All.AddMessage(message);
        }

        //public override Task OnConnected()
        //{
        //    return (base.OnConnected());
        //}

        //public override Task OnDisconnected(bool stopCalled)
        //{
        //    return (base.OnDisconnected(stopCalled));
        //}

        //public override Task OnReconnected()
        //{
        //    return (base.OnReconnected());
        //}
    }

}
