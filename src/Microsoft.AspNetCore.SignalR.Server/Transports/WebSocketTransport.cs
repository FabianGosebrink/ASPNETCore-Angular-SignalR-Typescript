// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.AspNetCore.SignalR.Json;
using Microsoft.AspNetCore.SignalR.WebSockets;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Microsoft.AspNetCore.SignalR.Transports
{
    public class WebSocketTransport : ForeverTransport
    {
        private readonly HttpContext _context;
        private IWebSocket _socket;
        private bool _isAlive = true;

        private readonly int? _maxIncomingMessageSize;

        private readonly Action<string> _message;
        private readonly Action _closed;
        private readonly Action<Exception> _error;
        private readonly IPerformanceCounterManager _counters;

        private static byte[] _keepAlive = Encoding.UTF8.GetBytes("{}");

        public WebSocketTransport(HttpContext context,
                                  JsonSerializer serializer,
                                  ITransportHeartbeat heartbeat,
                                  IPerformanceCounterManager performanceCounterManager,
                                  IApplicationLifetime applicationLifetime,
                                  ILoggerFactory loggerFactory,
                                  IMemoryPool pool)
            : this(context, serializer, heartbeat, performanceCounterManager, applicationLifetime, loggerFactory, pool, maxIncomingMessageSize: null)
        {
        }

        public WebSocketTransport(HttpContext context,
                                  JsonSerializer serializer,
                                  ITransportHeartbeat heartbeat,
                                  IPerformanceCounterManager performanceCounterManager,
                                  IApplicationLifetime applicationLifetime,
                                  ILoggerFactory loggerFactory,
                                  IMemoryPool pool,
                                  int? maxIncomingMessageSize)
            : base(context, serializer, heartbeat, performanceCounterManager, applicationLifetime, loggerFactory, pool)
        {
            _context = context;
            _maxIncomingMessageSize = maxIncomingMessageSize;

            _message = OnMessage;
            _closed = OnClosed;
            _error = OnSocketError;

            _counters = performanceCounterManager;
        }

        public override bool IsAlive
        {
            get
            {
                return _isAlive;
            }
        }

        public override CancellationToken CancellationToken
        {
            get
            {
                return CancellationToken.None;
            }
        }

        public override Task KeepAlive()
        {
            // Ensure delegate continues to use the C# Compiler static delegate caching optimization.
            return EnqueueOperation(state =>
            {
                var webSocket = (IWebSocket)state;
                return webSocket.Send(new ArraySegment<byte>(_keepAlive));
            },
            _socket);
        }

        public override Task ProcessRequest(ITransportConnection connection)
        {
            if (IsAbortRequest)
            {
                return connection.Abort(ConnectionId);
            }
            else
            {
                return AcceptWebSocketRequest(connection);
            }
        }

        public override Task Send(object value)
        {
            var context = new WebSocketTransportContext(this, value);

            // Ensure delegate continues to use the C# Compiler static delegate caching optimization.
            return EnqueueOperation(state => PerformSend(state), context);
        }

        public override Task Send(PersistentResponse response)
        {
            OnSendingResponse(response);

            return Send((object)response);
        }

        public override void IncrementConnectionsCount()
        {
            _counters.ConnectionsCurrentWebSockets.Increment();
        }

        public override void DecrementConnectionsCount()
        {
            _counters.ConnectionsCurrentWebSockets.Decrement();
        }

        private async Task AcceptWebSocketRequest(ITransportConnection connection)
        {
            var handler = new DefaultWebSocketHandler(_maxIncomingMessageSize, Logger);

            // Configure event handlers before calling ProcessWebSocketRequestAsync
            _socket = handler;
            _socket.OnClose = _closed;
            _socket.OnMessage = _message;
            _socket.OnError = _error;

            WebSocket webSocket;

            try
            {
                webSocket = await Context.WebSockets.AcceptWebSocketAsync();
            }
            catch
            {
                // Bad Request
                _context.Response.StatusCode = 400;
                await _context.Response.WriteAsync(Resources.Error_NotWebSocketRequest);
                return;
            }

            // Start the websocket handler so that we can process things over the channel
            var webSocketHandlerTask = handler.ProcessWebSocketRequestAsync(webSocket, CancellationToken);

            // This needs to come after wiring up the websocket handler
            var ignoredTask = ProcessRequestCore(connection)
                .ContinueWith(async (_, state) =>
            {
                await ((DefaultWebSocketHandler)state).CloseAsync();
            },
            handler);

            await webSocketHandlerTask;
        }

        private static async Task PerformSend(object state)
        {
            var context = (WebSocketTransportContext)state;
            var socket = context.Transport._socket;

            using (var writer = new BinaryMemoryPoolTextWriter(context.Transport.Pool))
            {
                try
                {
                    context.Transport.JsonSerializer.Serialize(context.State, writer);
                    writer.Flush();

                    await socket.Send(writer.Buffer).PreserveCulture();
                }
                catch (Exception ex)
                {
                    // OnError will close the socket in the event of a JSON serialization or flush error.
                    // The client should then immediately reconnect instead of simply missing keep-alives.
                    context.Transport.OnError(ex);
                    throw;
                }
            }
        }

        private void OnMessage(string message)
        {
            if (Received != null)
            {
                Received(message).Catch(Logger);
            }
        }

        private void OnClosed()
        {
            Logger.LogInformation(String.Format("CloseSocket({0})", ConnectionId));

            // Require a request to /abort to stop tracking the connection. #2195
            _isAlive = false;
        }

        private void OnSocketError(Exception error)
        {
            Logger.LogError(String.Format("OnError({0}, {1})", ConnectionId, error));
        }

        private class WebSocketTransportContext
        {
            public readonly WebSocketTransport Transport;
            public readonly object State;

            public WebSocketTransportContext(WebSocketTransport transport, object state)
            {
                Transport = transport;
                State = state;
            }
        }
    }
}
