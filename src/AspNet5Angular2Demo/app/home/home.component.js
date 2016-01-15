var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('angular2/core');
var common_1 = require('angular2/common');
var PersonDataService_1 = require('../services/PersonDataService');
var HomeComponent = (function () {
    function HomeComponent(_router, _dataService) {
        this._router = _router;
        this._dataService = _dataService;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.getAllFood();
    };
    HomeComponent.prototype.getAllFood = function () {
        var _this = this;
        this._dataService
            .GetAllFood()
            .subscribe(function (data) {
            _this.foodItems = data;
        }, function (response) {
            console.log(response);
        }, function () { return console.log('Call complete'); });
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            providers: [PersonDataService_1.DataService],
            templateUrl: 'app/home/home.component.html',
            directives: [common_1.CORE_DIRECTIVES]
        })
    ], HomeComponent);
    return HomeComponent;
})();
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map