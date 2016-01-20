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
var foodDataService_1 = require('../services/foodDataService');
var signalRService_1 = require('../common/signalRService');
var IFoodItem_1 = require('../models/IFoodItem');
var FoodComponent = (function () {
    function FoodComponent(_dataService, _signalRService) {
        this._dataService = _dataService;
        this._signalRService = _signalRService;
        this.canAddFood = false;
        this.currentFoodItem = new IFoodItem_1.IFoodItem();
    }
    FoodComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getAllFood();
        this._signalRService.connectionEstablished.subscribe(function () {
            _this.canAddFood = !_this.canAddFood;
        });
        this._signalRService.foodchanged.subscribe(function () {
            _this.getAllFood();
        });
    };
    FoodComponent.prototype.saveFood = function () {
        var _this = this;
        if (this.currentFoodItem.Id) {
            this._dataService
                .Update(this.currentFoodItem.Id, this.currentFoodItem)
                .subscribe(function (data) {
                _this.currentFoodItem = new IFoodItem_1.IFoodItem();
            }, function (error) {
                console.log(error);
            }, function () { return console.log('Update complete'); });
        }
        else {
            this._dataService
                .AddFood(this.currentFoodItem.ItemName)
                .subscribe(function (data) {
                _this.currentFoodItem = new IFoodItem_1.IFoodItem();
            }, function (error) {
                console.log(error);
            }, function () { return console.log('Added complete'); });
        }
    };
    FoodComponent.prototype.deleteFoodItem = function (foodItem) {
        var _this = this;
        this._dataService.DeleteFood(foodItem.Id)
            .subscribe(function (response) {
            _this._signalRService.FoodDeleted();
        }, function (error) {
            console.log(error);
        }, function () {
            console.log("Deleted");
        });
    };
    FoodComponent.prototype.setFoodItemToEdit = function (foodItem) {
        this.currentFoodItem = foodItem;
    };
    FoodComponent.prototype.getAllFood = function () {
        var _this = this;
        this._dataService
            .GetAllFood()
            .subscribe(function (data) { return _this.foodItems = data; }, function (error) { return console.log(error); }, function () { return console.log('Get all Foods complete'); });
    };
    FoodComponent = __decorate([
        core_1.Component({
            selector: 'food-component',
            templateUrl: 'app/food/food.component.html',
            directives: [common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [foodDataService_1.DataService, signalRService_1.SignalRService])
    ], FoodComponent);
    return FoodComponent;
})();
exports.FoodComponent = FoodComponent;
//# sourceMappingURL=foodcomponent.js.map