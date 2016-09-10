using System;

namespace ASPNETCoreAngular2Demo.Services
{
    public interface ITimerService
    {
        event EventHandler TimerElapsed;
    }
}