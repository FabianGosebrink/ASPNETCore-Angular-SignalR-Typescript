System.register(['angular2/core', 'angular2/router', 'angular2/common', '../services/foodDataService'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, common_1, foodDataService_1;
    var HomeComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (foodDataService_1_1) {
                foodDataService_1 = foodDataService_1_1;
            }],
        execute: function() {
            HomeComponent = (function () {
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
                        .subscribe(function (data) { return _this.foodItems = data; }, function (err) { return console.log(err); }, function () { return console.log('Random Quote Complete'); });
                };
                HomeComponent = __decorate([
                    core_1.Component({
                        selector: 'home',
                        providers: [foodDataService_1.DataService],
                        templateUrl: 'app/home/home.component.html',
                        directives: [common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, foodDataService_1.DataService])
                ], HomeComponent);
                return HomeComponent;
                var _a;
            })();
            exports_1("HomeComponent", HomeComponent);
        }
    }
});
//# sourceMappingURL=home.component.js.map