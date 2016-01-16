import {Component, Output, EventEmitter} from 'angular2/core';
import {IFoodItem} from '../models/IFoodItem';
import { DataService } from '../services/foodDataService';

@Component({
    selector: 'food-form',
    templateUrl: 'app/food/foodForm.component.html'
})
export class FoodForm {
    
    //@Output() newFoodItem = new EventEmitter<IFoodItem>();
    @Output() newFoodItem = new EventEmitter();
    
    public foodName: string;

    constructor(private _dataService: DataService) {
        this.foodName = "";
    }

    addFood() {
        this._dataService
        .AddFood(this.foodName)
        .subscribe(data => {
                this.newFoodItem.emit("event");
                this.foodName = "";
            }, err => {
                console.log(err)},
            () => console.log('Call Complete'));
    }
}