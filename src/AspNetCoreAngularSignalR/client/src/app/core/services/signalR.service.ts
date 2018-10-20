import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { ChatMessage } from '../../models/chatMessage.model';
import { CONFIGURATION } from '../../shared/app.constants';

const WAIT_UNTIL_ASPNETCORE_IS_READY_DELAY_IN_MS = 2000;

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

  private startConnection() {
    setTimeout(() => {
      this.hubConnection.start().then(() => {
        console.log('Hub connection started');
        this.connectionEstablished.next(true);
      });
    }, WAIT_UNTIL_ASPNETCORE_IS_READY_DELAY_IN_MS);
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
