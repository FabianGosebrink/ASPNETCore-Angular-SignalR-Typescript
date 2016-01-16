import {Component, Output, EventEmitter} from 'angular2/core';
import {IFoodItem} from '../models/IFoodItem';
import { DataService } from '../services/foodDataService';

@Component({
    selector: 'food-form',
    template: `
    <form (ngSubmit)="addFood()">
      <input type="text" [(ngModel)]="foodName" size="30" placeholder="add new food here">
      <input class="btn-primary" type="submit" value="add">
    </form>`
})
export class FoodForm {
    @Output() newFoodItem = new EventEmitter<IFoodItem>();
    public foodName: string;

    constructor(private _dataService: DataService) {
        this.foodName = "";
    }

    addFood() {
        
        console.log(this.foodName);
        
        this._dataService
        .AddFood(this.foodName)
        .subscribe(data => {
                console.log("Added Food" + data);
                this.newFoodItem.next(data);
            }, err => console.log(err),
            () => console.log('Call Complete'));
    }
}