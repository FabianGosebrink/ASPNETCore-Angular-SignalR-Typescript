// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

using System;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Microsoft.AspNetCore.SignalR.WebSockets
{
    public class DefaultWebSocketHandler : WebSocketHandler, IWebSocket
    {
        private readonly IWebSocket _webSocket;
        private volatile bool _closed;

        public DefaultWebSocketHandler(int? maxIncomingMessageSize, ILogger logger)
            : base(maxIncomingMessageSize, logger)
        {
            _webSocket = this;

            _webSocket.OnClose = () => { };
            _webSocket.OnError = e => { };
            _webSocket.OnMessage = msg => { };
        }

        public override void OnClose()
        {
            _closed = true;

            _webSocket.OnClose();
        }

        public override void OnError()
        {
            _webSocket.OnError(Error);
        }

        public override void OnMessage(string message)
        {
            _webSocket.OnMessage(message);
        }

        Action<string> IWebSocket.OnMessage
        {
            get;
            set;
        }

        Action IWebSocket.OnClose
        {
            get;
            set;
        }

        Action<Exception> IWebSocket.OnError
        {
            get;
            set;
        }

        public Task Send(ArraySegment<byte> message)
        {
            if (_closed)
            {
                return TaskAsyncHelper.Empty;
            }

            return base.SendAsync(message, WebSocketMessageType.Text);
        }

        public override Task CloseAsync()
        {
            if (_closed)
            {
                return TaskAsyncHelper.Empty;
            }

            return base.CloseAsync();
        }
    }
}
