var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONFIGURATION } from '../shared/app.constants';
import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr-client';
var SignalRService = (function () {
    function SignalRService() {
        this.foodchanged = new EventEmitter();
        this.messageReceived = new EventEmitter();
        this.newCpuValue = new EventEmitter();
        this.connectionEstablished = new EventEmitter();
        this.connectionExists = false;
        this._hubConnection = new HubConnection(CONFIGURATION.baseUrls.server + 'coolmessages');
        this.registerOnServerEvents();
        this.startConnection();
    }
    SignalRService.prototype.sendChatMessage = function (message) {
        this._hubConnection.invoke('SendMessage', message);
    };
    SignalRService.prototype.startConnection = function () {
        var _this = this;
        this._hubConnection.start()
            .then(function () {
            console.log('Hub connection started');
            _this.connectionEstablished.emit(true);
        })
            .catch(function (err) {
            console.log('Error while establishing connection');
        });
    };
    SignalRService.prototype.registerOnServerEvents = function () {
        var _this = this;
        this._hubConnection.on('FoodAdded', function (data) {
            _this.foodchanged.emit(data);
        });
        this._hubConnection.on('FoodDeleted', function (data) {
            _this.foodchanged.emit('this could be data');
        });
        this._hubConnection.on('FoodUpdated', function (data) {
            _this.foodchanged.emit('this could be data');
        });
        this._hubConnection.on('Send', function (data) {
            var recieved = "Recieved: " + data;
            console.log(recieved);
            _this.messageReceived.emit(data);
        });
        this._hubConnection.on('newCpuValue', function (data) {
            _this.newCpuValue.emit(data);
        });
    };
    return SignalRService;
}());
SignalRService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], SignalRService);
export { SignalRService };
//# sourceMappingURL=signalRService.js.map