using System;
using System.Threading;
using Microsoft.Extensions.Options;

namespace ASPNETCoreAngular2Demo.Services
{
    public class TimerService : ITimerService
    {
        private Timer _timer;
        readonly Random _random = new Random();
        public event EventHandler TimerElapsed;

        public TimerService(IOptions<TimerServiceConfiguration> options)
        {
            var optionsTimerServiceConfiguration = options;
            _timer = new Timer(
                OnTimerElapsed, 
                null, 
                optionsTimerServiceConfiguration.Value.DueTime, 
                optionsTimerServiceConfiguration.Value.Period);
        }

        private void OnTimerElapsed(object sender)
        {
            TimerElapsed?.Invoke(this, new TimerEventArgs(_random.Next(0, 100)));
        }
    }
}
