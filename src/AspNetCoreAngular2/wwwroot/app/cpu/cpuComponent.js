var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var signalRService_1 = require('../services/signalRService');
var CpuComponent = (function () {
    function CpuComponent(_signalRService) {
        this._signalRService = _signalRService;
    }
    CpuComponent.prototype.ngOnInit = function () {
        this.subscribeToEvents();
    };
    CpuComponent.prototype.subscribeToEvents = function () {
        var _this = this;
        this._signalRService.newCpuValue.subscribe(function (cpuValue) {
            _this.cpuValue = cpuValue;
        });
    };
    CpuComponent = __decorate([
        core_1.Component({
            selector: 'cpu-component',
            templateUrl: 'app/cpu/cpu.component.html',
            directives: [common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [signalRService_1.SignalRService])
    ], CpuComponent);
    return CpuComponent;
})();
exports.CpuComponent = CpuComponent;
//# sourceMappingURL=cpuComponent.js.map