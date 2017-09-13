var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { SignalRService } from '../../services/signalRService';
import { ChatMessage } from '../../models/chatMessage.model';
var ChatComponent = (function () {
    function ChatComponent(_signalRService, _ngZone) {
        this._signalRService = _signalRService;
        this._ngZone = _ngZone;
        this.subscribeToEvents();
        this.canSendMessage = _signalRService.connectionExists;
        this.currentMessage = new ChatMessage('', null);
        this.allMessages = new Array();
    }
    ChatComponent.prototype.sendMessage = function () {
        if (this.canSendMessage) {
            this.currentMessage.Sent = new Date();
            this._signalRService.sendChatMessage(this.currentMessage);
        }
    };
    ChatComponent.prototype.subscribeToEvents = function () {
        var _this = this;
        this._signalRService.connectionEstablished.subscribe(function () {
            _this.canSendMessage = true;
        });
        this._signalRService.messageReceived.subscribe(function (message) {
            _this._ngZone.run(function () {
                _this.currentMessage = new ChatMessage('', null);
                _this.allMessages.push(new ChatMessage(message.Message, message.Sent.toString()));
            });
        });
    };
    return ChatComponent;
}());
ChatComponent = __decorate([
    Component({
        selector: 'app-chat-component',
        templateUrl: 'chat.component.html'
    }),
    __metadata("design:paramtypes", [SignalRService, NgZone])
], ChatComponent);
export { ChatComponent };
//# sourceMappingURL=chat.component.js.map