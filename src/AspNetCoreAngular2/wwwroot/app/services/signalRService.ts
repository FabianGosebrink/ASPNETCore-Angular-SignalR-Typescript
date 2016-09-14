import { Injectable, EventEmitter } from '@angular/core';
import { CONFIGURATION } from '../shared/app.constants';
import { ChatMessage } from '../models/ChatMessage';

declare var $;

@Injectable()
export class SignalRService {

    private proxy;
    private proxyName: string = 'coolmessages';
    private connection;

    public foodchanged: EventEmitter<any>;
    public messageReceived: EventEmitter<ChatMessage>;
    public newCpuValue: EventEmitter<Number>;
    public connectionEstablished: EventEmitter<Boolean>;
    public connectionExists: Boolean;

    constructor() {
        this.foodchanged = new EventEmitter();
        this.connectionEstablished = new EventEmitter<Boolean>();
        this.messageReceived = new EventEmitter<ChatMessage>();
        this.newCpuValue = new EventEmitter<Number>();
        this.connectionExists = false;

        this.connection = $.hubConnection(CONFIGURATION.baseUrls.server + 'signalr/');
        this.proxy = this.connection.createHubProxy(this.proxyName);

        this.registerOnServerEvents();

        this.startConnection();
    }

    public sendChatMessage(message: ChatMessage) {
        this.proxy.invoke('SendMessage', message);
    }

    private startConnection(): void {
        this.connection.start().done((data) => {
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            this.connectionEstablished.emit(true);
            this.connectionExists = true;
        }).fail((error) => {
            console.log('Could not connect ' + error);
            this.connectionEstablished.emit(false);
        });
    }

    private registerOnServerEvents(): void {
        this.proxy.on('FoodAdded', (data) => {
            this.foodchanged.emit(data);
        });

        this.proxy.on('FoodDeleted', (data) => {
            this.foodchanged.emit('this could be data');
        });

        this.proxy.on('FoodUpdated', (data) => {
            this.foodchanged.emit('this could be data');
        });

        this.proxy.on('SendMessage', (data: ChatMessage) => {
            console.log('received in SignalRService: ' + JSON.stringify(data));
            this.messageReceived.emit(data);
        });

        this.proxy.on('newCpuValue', (data: number) => {
            this.newCpuValue.emit(data);
        });
    }
}
