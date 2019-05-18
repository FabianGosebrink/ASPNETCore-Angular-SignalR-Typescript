import { Injectable } from '@angular/core';
import { ChatMessage } from '@app/models/chatMessage.model';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState
} from '@aspnet/signalr';
import { environment } from '@environments/environment';
import { Subject, BehaviorSubject } from 'rxjs';

const WAIT_UNTIL_ASPNETCORE_IS_READY_DELAY_IN_MS = 2000;

@Injectable({ providedIn: 'root' })
export class SignalRService {
  foodchanged$ = new Subject();
  messageReceived$ = new Subject<ChatMessage>();
  newCpuValue$ = new Subject<number>();
  connectionEstablished$ = new BehaviorSubject<boolean>(false);

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
      .withUrl(environment.baseUrls.server + 'coolmessages')
      .build();
  }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    setTimeout(() => {
      this.hubConnection.start().then(
        () => {
          console.log('Hub connection started');
          this.connectionEstablished$.next(true);
        },
        error => console.error(error)
      );
    }, WAIT_UNTIL_ASPNETCORE_IS_READY_DELAY_IN_MS);
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('FoodAdded', (data: any) => {
      this.foodchanged$.next(data);
    });

    this.hubConnection.on('FoodDeleted', (data: any) => {
      this.foodchanged$.next('this could be data');
    });

    this.hubConnection.on('FoodUpdated', (data: any) => {
      this.foodchanged$.next('this could be data');
    });

    this.hubConnection.on('Send', (data: any) => {
      this.messageReceived$.next(data);
    });

    this.hubConnection.on('newCpuValue', (data: number) => {
      this.newCpuValue$.next(data);
    });
  }
}
