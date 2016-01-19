import { Component, OnInit, Output, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../common/signalRService';
import { IFoodItem } from '../models/IFoodItem';

@Component({
    selector: 'food-component',
    templateUrl: 'app/food/food.component.html',
    directives: [CORE_DIRECTIVES]
})

export class FoodComponent implements OnInit {
    public foodItems: IFoodItem[];
    public currentFoodItem: IFoodItem;
    public canAddFood: boolean;

    constructor(private _dataService: DataService, private _signalRService: SignalRService) {
        this.canAddFood = false;
        this.currentFoodItem = new IFoodItem();
    }

    ngOnInit() {
        this.getAllFood();

        this._signalRService.connectionEstablished.subscribe(() => {
            this.canAddFood = !this.canAddFood;
        });

        this._signalRService.foodchanged.subscribe(() => {
             this.getAllFood();
        });
    }
    
    saveFood() {
        if(this.currentFoodItem.Id){
            this._dataService
                .Update(this.currentFoodItem.Id, this.currentFoodItem)
                .subscribe(data => {
                this.currentFoodItem = new IFoodItem();
            }, err => {
                console.log(err)},
            () => console.log('Added complete'));
        } else{
              this._dataService
                    .AddFood(this.currentFoodItem.ItemName)
                    .subscribe(data => {
                        this.currentFoodItem = new IFoodItem();
            }, err => {
                console.log(err)},
            () => console.log('Added complete'));
        }
      
    }
    
    public deleteFoodItem(foodItem: IFoodItem) {
        this._dataService.DeleteFood(foodItem.Id)
        .subscribe(
            response => {
                this._signalRService.FoodDeleted();
            }, error => {
                console.log(error);
            },() => {
                console.log("Deleted");
            });
    }
    
    public setFoodItemToEdit(foodItem: IFoodItem){
        this.currentFoodItem = foodItem;
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe((data:IFoodItem[]) => this.foodItems = data,
                err => console.log(err),
                () => console.log('Get all Foods complete'));
    }
}