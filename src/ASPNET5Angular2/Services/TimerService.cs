using System;
using System.Threading;

namespace ASPNET5Angular2.Services
{
    public class TimerService : ITimerService
    {
        private Timer _timer;
        readonly Random _random = new Random();
        public event EventHandler TimerElapsed;

        public TimerService()
        {
            _timer = new Timer(OnTimerElapsed, null, 3000, 1500);
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
