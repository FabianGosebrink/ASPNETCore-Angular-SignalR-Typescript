using System;

namespace Microsoft.AspNet.SignalR.Infrastructure
{
    public class BinaryMemoryPoolTextWriter : MemoryPoolTextWriter, IBinaryWriter
    {
        public BinaryMemoryPoolTextWriter(IMemoryPool memory)
            : base(memory)
        {
        }
    }
}