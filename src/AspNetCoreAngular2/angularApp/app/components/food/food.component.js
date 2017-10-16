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
import { DataService } from '../../services/foodDataService';
import { SignalRService } from '../../services/signalRService';
import { FoodItem } from '../../models/foodItem.model';
var FoodComponent = (function () {
    function FoodComponent(_dataService, _signalRService, _ngZone) {
        this._dataService = _dataService;
        this._signalRService = _signalRService;
        this._ngZone = _ngZone;
        this.canAddFood = _signalRService.connectionExists;
        this.currentFoodItem = new FoodItem();
        this.foodItems = [];
    }
    FoodComponent.prototype.ngOnInit = function () {
        this.subscribeToEvents();
        this.getAllFood();
    };
    FoodComponent.prototype.saveFood = function () {
        var _this = this;
        if (this.currentFoodItem.id) {
            this._dataService
                .Update(this.currentFoodItem.id, this.currentFoodItem)
                .subscribe(function (data) {
                _this.currentFoodItem = new FoodItem();
            }, function (error) {
                console.log(error);
            }, function () { return console.log('Update complete'); });
        }
        else {
            this._dataService
                .AddFood(this.currentFoodItem.itemName)
                .subscribe(function (data) {
                _this.currentFoodItem = new FoodItem();
            }, function (error) {
                console.log(error);
            }, function () { return console.log('Added complete'); });
        }
    };
    FoodComponent.prototype.deleteFoodItem = function (foodItem) {
        this._dataService.DeleteFood(foodItem.id)
            .subscribe(function (response) {
        }, function (error) {
            console.log(error);
        }, function () {
            console.log('Deleted complete');
        });
    };
    FoodComponent.prototype.setFoodItemToEdit = function (foodItem) {
        this.currentFoodItem = foodItem;
    };
    FoodComponent.prototype.getAllFood = function () {
        var _this = this;
        this._ngZone.run(function () {
            _this._dataService
                .GetAllFood()
                .subscribe(function (data) {
                _this.foodItems = data;
            }, function (error) { return console.log(error); }, function () { return console.log('Get all Foods complete ' + JSON.stringify(_this.foodItems)); });
        });
    };
    FoodComponent.prototype.subscribeToEvents = function () {
        var _this = this;
        this._signalRService.connectionEstablished.subscribe(function () {
            _this.canAddFood = true;
        });
        this._signalRService.foodchanged.subscribe(function (data) {
            _this.getAllFood();
        });
    };
    return FoodComponent;
}());
FoodComponent = __decorate([
    Component({
        selector: 'app-food-component',
        templateUrl: 'food.component.html'
    }),
    __metadata("design:paramtypes", [DataService,
        SignalRService,
        NgZone])
], FoodComponent);
export { FoodComponent };
//# sourceMappingURL=food.component.js.map