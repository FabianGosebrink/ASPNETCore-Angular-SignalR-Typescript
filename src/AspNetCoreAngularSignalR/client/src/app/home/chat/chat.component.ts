import { Component, NgZone } from '@angular/core';
import { SignalRService } from '../../core/services/signalR.service';
import { ChatMessage } from '../../models/chatMessage.model';

@Component({
  selector: 'app-chat-component',
  templateUrl: 'chat.component.html'
})
export class ChatComponent {
  currentMessage: ChatMessage = new ChatMessage();
  allMessages: ChatMessage[] = [];
  canSendMessage: boolean;

  constructor(private signalRService: SignalRService, private ngZone: NgZone) {
    this.subscribeToEvents();
  }

  sendMessage() {
    if (this.canSendMessage) {
      this.currentMessage.sent = new Date();
      this.signalRService.sendChatMessage(this.currentMessage);
    }
  }

  private subscribeToEvents(): void {
    this.signalRService.connectionEstablished.subscribe(() => {
      this.canSendMessage = true;
    });

    this.signalRService.messageReceived.subscribe((message: ChatMessage) => {
      this.ngZone.run(() => {
        this.currentMessage = new ChatMessage();
        this.allMessages.push(
          new ChatMessage(message.message, message.sent.toString())
        );
      });
    });
  }
}
