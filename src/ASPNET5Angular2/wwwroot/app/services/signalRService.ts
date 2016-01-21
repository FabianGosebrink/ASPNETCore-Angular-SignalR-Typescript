/// <reference path="../../../typings/signalr/signalr.d.ts" />

import { Injectable, EventEmitter } from "angular2/core";
import { Configuration } from '../app.constants';
import { ChatMessage } from '../models/ChatMessage';

@Injectable()
export class SignalRService {

    private proxy: HubProxy;
    private proxyName: string = "coolmessages";
    private connection: HubConnection;

    public foodchanged: EventEmitter<any>;
    public messageReceived: EventEmitter<ChatMessage>;
    public connectionEstablished: EventEmitter<Boolean>;

    constructor(private _configuration: Configuration) {
        this.foodchanged = new EventEmitter();
        this.connectionEstablished = new EventEmitter<Boolean>();
        this.messageReceived = new EventEmitter<ChatMessage>();
        
        this.connection = jQuery.hubConnection(this._configuration.Server + "signalr/");
        this.proxy = this.connection.createHubProxy(this.proxyName);

        this.registerOnServerEvents();

        this.startConnection();
    }
    
    public sendChatMessage(message: ChatMessage) {
        this.proxy.invoke("SendMessage", message);
    }

    private startConnection(): void {
        this.connection.start().done((data) => {
            console.log("Now connected " + data.transport.name + ", connection ID= " + data.id);
            this.connectionEstablished.emit(true);
        }).fail((error) => {
            console.log("Could not connect " + error);
            this.connectionEstablished.emit(false);
        });
    }


    private registerOnServerEvents(): void {
        this.proxy.on("FoodAdded", (data) => {
            this.foodchanged.emit("this could be data");
        });

        this.proxy.on("FoodDeleted", (data) => {
            this.foodchanged.emit("this could be data");
        });

        this.proxy.on("FoodUpdated", (data) => {
            this.foodchanged.emit("this could be data");
        });

        this.proxy.on("SendMessage", (data: ChatMessage) => {
            console.log("received in SignalRService: " + data);
            this.messageReceived.emit(data);
        });
    }
}
