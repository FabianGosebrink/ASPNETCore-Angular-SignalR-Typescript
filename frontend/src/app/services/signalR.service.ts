import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: HubConnection;

  private foodchanged = new Subject();

  private messageReceived = new Subject<ChatMessage>();

  private newCpuValue = new Subject<number>();

  private connectionEstablished = new BehaviorSubject<boolean>(false);

  get foodChanged$() {
    return this.foodchanged.asObservable();
  }

  get messageReceived$() {
    return this.messageReceived.asObservable();
  }

  get newCpuValue$() {
    return this.newCpuValue.asObservable();
  }

  get connectionEstablished$() {
    return this.connectionEstablished.asObservable();
  }

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
      .withUrl(environment.baseUrls.server + 'coolmessages')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        this.connectionEstablished.next(true);
      },
      (error) => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('FoodAdded', (data) => {
      this.foodchanged.next(data);
    });

    this.hubConnection.on('FoodDeleted', () => {
      this.foodchanged.next('this could be data');
    });

    this.hubConnection.on('FoodUpdated', () => {
      this.foodchanged.next('this could be data');
    });

    this.hubConnection.on('Send', (data) => {
      this.messageReceived.next(data);
    });

    this.hubConnection.on('newCpuValue', (data: number) => {
      this.newCpuValue.next(data);
    });
  }
}
