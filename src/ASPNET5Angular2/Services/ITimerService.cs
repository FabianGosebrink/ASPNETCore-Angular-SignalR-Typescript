using System;

namespace ASPNET5Angular2.Services
{
    public interface ITimerService
    {
        event EventHandler TimerElapsed;
    }
}