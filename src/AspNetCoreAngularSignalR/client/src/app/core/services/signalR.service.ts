import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { ChatMessage } from '../../models/chatMessage.model';
import { CONFIGURATION } from '../../shared/app.constants';

@Injectable()
export class SignalRService {
  foodchanged = new Subject();
  messageReceived = new Subject<ChatMessage>();
  newCpuValue = new Subject<Number>();
  connectionEstablished = new Subject<Boolean>();
  private hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendChatMessage(message: ChatMessage) {
    this.hubConnection.invoke('SendMessage', message);
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(CONFIGURATION.baseUrls.server + 'coolmessages')
      .build();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Hub connection started');
        this.connectionEstablished.next(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(this.startConnection(), 5000);
      });
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('FoodAdded', (data: any) => {
      this.foodchanged.next(data);
    });

    this.hubConnection.on('FoodDeleted', (data: any) => {
      this.foodchanged.next('this could be data');
    });

    this.hubConnection.on('FoodUpdated', (data: any) => {
      this.foodchanged.next('this could be data');
    });

    this.hubConnection.on('Send', (data: any) => {
      this.messageReceived.next(data);
    });

    this.hubConnection.on('newCpuValue', (data: number) => {
      this.newCpuValue.next(data);
    });
  }
}
