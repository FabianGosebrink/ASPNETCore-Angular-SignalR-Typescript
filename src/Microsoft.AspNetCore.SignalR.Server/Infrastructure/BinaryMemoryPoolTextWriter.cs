using System;

namespace Microsoft.AspNetCore.SignalR.Infrastructure
{
    public class BinaryMemoryPoolTextWriter : MemoryPoolTextWriter, IBinaryWriter
    {
        public BinaryMemoryPoolTextWriter(IMemoryPool memory)
            : base(memory)
        {
        }
    }
}