import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SignalRService } from '../services/signalRService';
import { ChatMessage } from '../models/ChatMessage';

@Component({
    selector: 'chat-component',
    templateUrl: 'app/chat/chat.component.html',
    directives: [CORE_DIRECTIVES]
})


export class ChatComponent {

    public currentMessage: ChatMessage;
    public allMessages: ChatMessage[];
    public canSendMessage: Boolean;

    constructor(private _signalRService: SignalRService) {
        this.subscribeToEvents();
        this.canSendMessage = false;
        this.currentMessage = new ChatMessage();
        this.allMessages = new Array<ChatMessage>();
    }

    public sendMessage() {
        this.currentMessage.Sent = new Date();
        this._signalRService.sendChatMessage(this.currentMessage);
    }

    private subscribeToEvents(): void {
        this._signalRService.connectionEstablished.subscribe(() => {
            this.canSendMessage = true;
        });

        this._signalRService.messageReceived.subscribe((message: ChatMessage) => {
            this.currentMessage = new ChatMessage();
            this.allMessages.push(message);
        });
    }
}