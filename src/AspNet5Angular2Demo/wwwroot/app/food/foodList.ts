import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {IFoodItem} from '../models/IFoodItem';
import { DataService } from '../services/foodDataService';

@Component({
    selector: 'food-list',
    templateUrl: 'app/food/foodList.component.html'
})
export class FoodList {
    @Input() foodItems: IFoodItem[];
    @Output() deletedFoodItem = new EventEmitter();
    
    constructor(private _dataService: DataService) {
    }

    public deleteFoodItem(foodItem) {
        this._dataService.DeleteFood(foodItem.Id).subscribe(response => {
            console.log(response);
            this.deletedFoodItem.emit("");
        }, error => {
            console.log(error);
        },
        () => {
            console.log("Deleted");
        });
    }
    
}