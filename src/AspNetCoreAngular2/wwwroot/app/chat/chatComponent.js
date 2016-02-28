System.register(['angular2/core', 'angular2/common', '../services/signalRService', '../models/ChatMessage'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, signalRService_1, ChatMessage_1;
    var ChatComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (signalRService_1_1) {
                signalRService_1 = signalRService_1_1;
            },
            function (ChatMessage_1_1) {
                ChatMessage_1 = ChatMessage_1_1;
            }],
        execute: function() {
            ChatComponent = (function () {
                function ChatComponent(_signalRService) {
                    this._signalRService = _signalRService;
                    this.subscribeToEvents();
                    this.canSendMessage = _signalRService.connectionExists;
                    this.currentMessage = new ChatMessage_1.ChatMessage('', null);
                    this.allMessages = new Array();
                }
                ChatComponent.prototype.sendMessage = function () {
                    this.currentMessage.Sent = new Date();
                    this._signalRService.sendChatMessage(this.currentMessage);
                };
                ChatComponent.prototype.subscribeToEvents = function () {
                    var _this = this;
                    this._signalRService.connectionEstablished.subscribe(function () {
                        _this.canSendMessage = true;
                    });
                    this._signalRService.messageReceived.subscribe(function (message) {
                        _this.currentMessage = new ChatMessage_1.ChatMessage("", null);
                        _this.allMessages.push(new ChatMessage_1.ChatMessage(message.Message, message.Sent.toString()));
                    });
                };
                ChatComponent = __decorate([
                    core_1.Component({
                        selector: 'chat-component',
                        templateUrl: 'app/chat/chat.component.html',
                        directives: [common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [signalRService_1.SignalRService])
                ], ChatComponent);
                return ChatComponent;
            })();
            exports_1("ChatComponent", ChatComponent);
        }
    }
});
//# sourceMappingURL=chatComponent.js.map