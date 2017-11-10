using ASPNETCoreAngular2Demo.Hubs;
using ASPNETCoreAngular2Demo.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AspNetCoreAngular2.Services
{
    public class SchedulerHostedService : HostedServiceBase
    {
        private readonly ILogger<SchedulerHostedService> _logger;
        private readonly IOptions<TimerServiceConfiguration> _options;
        private readonly IHubContext<CoolMessagesHub> _coolMessageHubContext;

        private readonly Random _random = new Random();

        public SchedulerHostedService(
          ILoggerFactory loggerFactory,
          IOptions<TimerServiceConfiguration> options,
          IHubContext<CoolMessagesHub> hubContext)
        {
            _logger = loggerFactory.CreateLogger<SchedulerHostedService>();
            _options = options;
            _coolMessageHubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var randomValue = _random.Next(0, 100);

                _logger.LogInformation($"Sending newCpuValue {randomValue}...");

                await _coolMessageHubContext.Clients.All.InvokeAsync("newCpuValue", randomValue);
                
                await Task.Delay(TimeSpan.FromMilliseconds(_options.Value.Period), cancellationToken);
            }
        }
    }
}
