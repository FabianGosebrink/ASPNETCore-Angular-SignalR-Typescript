using System;

namespace AspNetCoreAngular2.Services
{
    public interface ITimerService
    {
        event EventHandler TimerElapsed;
    }
}