var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var app_constants_1 = require('../app.constants');
var SignalRService = (function () {
    function SignalRService(_configuration) {
        this._configuration = _configuration;
        this.foodchanged = new core_1.EventEmitter();
        this.connectionEstablished = new core_1.EventEmitter();
        this.connection = jQuery.hubConnection(_configuration.Server + "signalr/");
        this.proxy = this.connection.createHubProxy("coolmessages");
        this.registerOnServerEvents();
        this.startConnection();
    }
    SignalRService.prototype.startConnection = function () {
        var _this = this;
        this.connection.start().done(function (data) {
            console.log("Now connected " + data.transport.name + ", connection ID= " + data.id);
            _this.connectionEstablished.emit(true);
        }).fail(function (error) {
            console.log("Could not connect " + error);
            _this.connectionEstablished.emit(false);
        });
    };
    SignalRService.prototype.registerOnServerEvents = function () {
        var _this = this;
        this.proxy.on("FoodAdded", function (data) {
            _this.foodchanged.emit("this could be data");
        });
        this.proxy.on("FoodDeleted", function (data) {
            _this.foodchanged.emit("this could be data");
        });
        this.proxy.on("FoodUpdated", function (data) {
            _this.foodchanged.emit("this could be data");
            console.log("FoodUpdated");
        });
    };
    SignalRService.prototype.FoodAdded = function () {
        this.proxy.invoke("FoodAdded");
    };
    SignalRService.prototype.FoodDeleted = function () {
        this.proxy.invoke("FoodDeleted");
    };
    SignalRService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [app_constants_1.Configuration])
    ], SignalRService);
    return SignalRService;
})();
exports.SignalRService = SignalRService;
//# sourceMappingURL=signalRService.js.map