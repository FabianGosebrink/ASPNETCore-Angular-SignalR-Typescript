/// <reference path='../../../typings/signalr/signalr.d.ts' />
System.register(['angular2/core', '../app.constants'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, app_constants_1;
    var SignalRService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (app_constants_1_1) {
                app_constants_1 = app_constants_1_1;
            }],
        execute: function() {
            SignalRService = (function () {
                function SignalRService() {
                    this.proxyName = 'coolmessages';
                    this.foodchanged = new core_1.EventEmitter();
                    this.connectionEstablished = new core_1.EventEmitter();
                    this.messageReceived = new core_1.EventEmitter();
                    this.newCpuValue = new core_1.EventEmitter();
                    this.connectionExists = false;
                    this.connection = jQuery.hubConnection(app_constants_1.CONFIGURATION.baseUrls.server + 'signalr/');
                    this.proxy = this.connection.createHubProxy(this.proxyName);
                    this.registerOnServerEvents();
                    this.startConnection();
                }
                SignalRService.prototype.sendChatMessage = function (message) {
                    this.proxy.invoke('SendMessage', message);
                };
                SignalRService.prototype.startConnection = function () {
                    var _this = this;
                    this.connection.start().done(function (data) {
                        console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
                        _this.connectionEstablished.emit(true);
                        _this.connectionExists = true;
                    }).fail(function (error) {
                        console.log('Could not connect ' + error);
                        _this.connectionEstablished.emit(false);
                    });
                };
                SignalRService.prototype.registerOnServerEvents = function () {
                    var _this = this;
                    this.proxy.on('FoodAdded', function (data) {
                        _this.foodchanged.emit('this could be data');
                    });
                    this.proxy.on('FoodDeleted', function (data) {
                        _this.foodchanged.emit('this could be data');
                    });
                    this.proxy.on('FoodUpdated', function (data) {
                        _this.foodchanged.emit('this could be data');
                    });
                    this.proxy.on('SendMessage', function (data) {
                        console.log('received in SignalRService: ' + data);
                        _this.messageReceived.emit(data);
                    });
                    this.proxy.on('newCpuValue', function (data) {
                        _this.newCpuValue.emit(data);
                    });
                };
                SignalRService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SignalRService);
                return SignalRService;
            })();
            exports_1("SignalRService", SignalRService);
        }
    }
});
//# sourceMappingURL=signalRService.js.map