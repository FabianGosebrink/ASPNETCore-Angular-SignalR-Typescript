import { Injectable, EventEmitter } from '@angular/core';
import { CONFIGURATION } from '../shared/app.constants';
import { ChatMessage } from '../models/ChatMessage';

declare var $: any;

@Injectable()
export class SignalRService {

    private proxy: any;
    private proxyName: string = 'coolmessages';
    private connection: any;

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
        this.connection.start().done((data: any) => {
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            this.connectionEstablished.emit(true);
            this.connectionExists = true;
        }).fail((error: any) => {
            console.log('Could not connect ' + error);
            this.connectionEstablished.emit(false);
        });
    }

    private registerOnServerEvents(): void {
        this.proxy.on('FoodAdded', (data: any) => {
            this.foodchanged.emit(data);
        });

        this.proxy.on('FoodDeleted', (data: any) => {
            this.foodchanged.emit('this could be data');
        });

        this.proxy.on('FoodUpdated', (data: any) => {
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
