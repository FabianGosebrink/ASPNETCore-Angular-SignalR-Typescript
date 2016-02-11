import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../services/signalRService';
import { FoodItem } from '../models/FoodItem';

@Component({
    selector: 'food-component',
    providers: [DataService],
    templateUrl: 'app/food/food.component.html',
    directives: [CORE_DIRECTIVES]
})

export class FoodComponent implements OnInit {
    public foodItems: FoodItem[];
    public currentFoodItem: FoodItem;
    public canAddFood: Boolean;

    constructor(private _dataService: DataService, private _signalRService: SignalRService) {
        this.canAddFood = _signalRService.connectionExists;
        this.currentFoodItem = new FoodItem();
    }

    ngOnInit() {
        this.getAllFood();
        this.subscribeToEvents();
    }
    
    public saveFood() {
        if(this.currentFoodItem.Id){
            this._dataService
                .Update(this.currentFoodItem.Id, this.currentFoodItem)
                .subscribe(data => {
                    this.currentFoodItem = new FoodItem();
                }, error => {
                    console.log(error)
                },
                () => console.log('Update complete'));
        } else {
            this._dataService
                .AddFood(this.currentFoodItem.ItemName)
                .subscribe(data => {
                    this.currentFoodItem = new FoodItem();
                }, error => {
                    console.log(error)
                },
                () => console.log('Added complete'));
        }
    }
    
    public deleteFoodItem(foodItem: FoodItem) {
        this._dataService.DeleteFood(foodItem.Id)
            .subscribe(
                response => {
                    //this._signalRService.FoodDeleted();
                }, error => {
                    console.log(error);
                },() => {
                    console.log("Deleted complete");
                });
    }
    
    public setFoodItemToEdit(foodItem: FoodItem){
        this.currentFoodItem = foodItem;
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe((data:FoodItem[]) => this.foodItems = data,
                error => console.log(error),
                () => console.log('Get all Foods complete'));
    }
    
    private subscribeToEvents():void{
        this._signalRService.connectionEstablished.subscribe(() => {
            this.canAddFood = true;
        });

        this._signalRService.foodchanged.subscribe(() => {
             this.getAllFood();
        });
    }
}