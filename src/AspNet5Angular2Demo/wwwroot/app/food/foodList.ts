import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {IFoodItem} from '../models/IFoodItem';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../common/signalRService';

@Component({
    selector: 'food-list',
    templateUrl: 'app/food/foodList.component.html'
})

export class FoodList {
    @Input() foodItems: IFoodItem[];
    //@Output() deletedFoodItem = new EventEmitter();

    constructor(private _dataService: DataService, private _signalRService: SignalRService) {
    }

    public deleteFoodItem(foodItem: IFoodItem) {
        this._dataService.DeleteFood(foodItem.Id).subscribe(response => {
            this._signalRService.FoodDeleted();
        }, error => {
            console.log(error);
        },
            () => {
                console.log("Deleted");
            });
    }
}