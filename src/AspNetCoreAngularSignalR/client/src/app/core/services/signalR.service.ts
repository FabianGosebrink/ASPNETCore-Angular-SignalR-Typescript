import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { ChatMessage } from '../../models/chatMessage.model';
import { CONFIGURATION } from '../../shared/app.constants';

@Injectable()
export class SignalRService {
  foodchanged = new EventEmitter();
  messageReceived = new EventEmitter<ChatMessage>();
  newCpuValue = new EventEmitter<Number>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendChatMessage(message: ChatMessage) {
    this._hubConnection.invoke('SendMessage', message);
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(CONFIGURATION.baseUrls.server + 'coolmessages')
      .build();
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(this.startConnection(), 5000);
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
      this.messageReceived.emit(data);
    });

    this._hubConnection.on('newCpuValue', (data: number) => {
      this.newCpuValue.emit(data);
    });
  }
}
