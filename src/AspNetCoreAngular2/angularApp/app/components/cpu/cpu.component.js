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
var CpuComponent = (function () {
    function CpuComponent(_signalRService, _ngZone) {
        this._signalRService = _signalRService;
        this._ngZone = _ngZone;
    }
    CpuComponent.prototype.ngOnInit = function () {
        this.subscribeToEvents();
    };
    CpuComponent.prototype.subscribeToEvents = function () {
        var _this = this;
        this._signalRService.newCpuValue.subscribe(function (cpuValue) {
            _this._ngZone.run(function () {
                _this.cpuValue = cpuValue;
            });
        });
    };
    return CpuComponent;
}());
CpuComponent = __decorate([
    Component({
        selector: 'app-cpu-component',
        templateUrl: 'cpu.component.html'
    }),
    __metadata("design:paramtypes", [SignalRService, NgZone])
], CpuComponent);
export { CpuComponent };
//# sourceMappingURL=cpu.component.js.map