using System;

namespace ASPNETCoreAngular2Demo.Services
{
    public class TimerEventArgs : EventArgs
    {
        public TimerEventArgs(int value)
        {
            Value = value;
        }

        public int Value { get; }
    }
}