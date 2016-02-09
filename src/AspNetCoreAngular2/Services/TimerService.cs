using System;
using System.Threading;
using Microsoft.Extensions.OptionsModel;

namespace AspNetCoreAngular2.Services
{
    public class TimerService : ITimerService
    {
        private Timer _timer;
        readonly Random _random = new Random();
        public event EventHandler TimerElapsed;

        private IOptions<TimerServiceConfiguration> _optionsTimerServiceConfiguration;

        public TimerService(IOptions<TimerServiceConfiguration> options)
        {
            _optionsTimerServiceConfiguration = options;
            _timer = new Timer(
                OnTimerElapsed, 
                null, 
                _optionsTimerServiceConfiguration.Value.DueTime, 
                _optionsTimerServiceConfiguration.Value.Period);
        }

        private void OnTimerElapsed(object sender)
        {
            if (TimerElapsed != null)
            {
                TimerElapsed(this, new TimerEventArgs(_random.Next(0, 100)));
            }
        }
    }
}
