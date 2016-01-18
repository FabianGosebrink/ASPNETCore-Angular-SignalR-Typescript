import {Component, Output, EventEmitter} from 'angular2/core';
import {IFoodItem} from '../models/IFoodItem';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../common/signalRService';

@Component({
    selector: 'food-form',
    templateUrl: 'app/food/foodForm.component.html'
})
export class FoodForm {
    
    //@Output() newFoodItem = new EventEmitter();
    
    public foodName: string;
    public canAddFood: boolean;

    constructor(private _dataService: DataService, private _signalRService: SignalRService) {
        this.canAddFood=false;
        this.foodName = "";
        _signalRService.connectionEstablished.subscribe(()=>{
          this.canAddFood=!this.canAddFood;
        });
    }

    addFood() {
     
        this._dataService
        .AddFood(this.foodName)
        .subscribe(data => {
                //this.newFoodItem.emit("event");
                this.foodName = "";
            }, err => {
                console.log(err)},
            () => console.log('Call Complete'));
    }
}