using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Extensions.OptionsModel;

namespace Microsoft.AspNet.SignalR
{
    public class SignalROptionsSetup : ConfigureOptions<SignalROptions>
    {
        public SignalROptionsSetup() : base(ConfigureSignalR)
        {
        }

        private static void ConfigureSignalR(SignalROptions options)
        {
            // Add the authorization module by default
            options.Hubs.PipelineModules.Add(new AuthorizeModule());
        }
    }
}