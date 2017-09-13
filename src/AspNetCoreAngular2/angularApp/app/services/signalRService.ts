import { CONFIGURATION } from '../shared/app.constants';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';

import { ChatMessage } from '../models/chatMessage.model';

@Injectable()
export class SignalRService {

    foodchanged = new EventEmitter();
    messageReceived = new EventEmitter<ChatMessage>();
    newCpuValue = new EventEmitter<Number>();
    connectionEstablished = new EventEmitter<Boolean>();
    connectionExists = false;

    private _hubConnection: HubConnection;

    constructor() {

        this._hubConnection = new HubConnection(CONFIGURATION.baseUrls.server + 'coolmessages');

        this.registerOnServerEvents();

        this.startConnection();
    }

    public sendChatMessage(message: ChatMessage) {
        this._hubConnection.invoke('SendMessage', message);
    }

    private startConnection(): void {

        this._hubConnection.start()
            .then(() => {
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection')
            });
    }

    private registerOnServerEvents(): void {

        this._hubConnection.on('FoodAdded', (data: any) => {
            this.foodchanged.emit(data);
        });

        this._hubConnection.on('FoodDeleted', (data: any) => {
            this.foodchanged.emit('this could be data');
        });

        this._hubConnection.on('FoodUpdated', (data: any) => {
            this.foodchanged.emit('this could be data');
        });

        this._hubConnection.on('Send', (data: any) => {
            const recieved = `Recieved: ${data}`;
            console.log(recieved);
            this.messageReceived.emit(data);
        });

        this._hubConnection.on('newCpuValue', (data: number) => {
            this.newCpuValue.emit(data);
        });
    }
}
