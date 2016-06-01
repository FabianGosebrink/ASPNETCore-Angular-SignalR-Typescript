import { Component, OnInit } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { DataService } from '../../services/foodDataService';
import { SignalRService } from '../../services/signalRService';
import { FoodItem } from '../../models/FoodItem';

@Component({
    selector: 'food-component',
    providers: [DataService],
    templateUrl: 'app/components/food/food.component.html',
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

    public ngOnInit() {
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
                    // this._signalRService.FoodDeleted();
                }, error => {
                    console.log(error);
                }, () => {
                    console.log('Deleted complete');
                });
    }

    public setFoodItemToEdit(foodItem: FoodItem){
        this.currentFoodItem = foodItem;
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe(data => this.foodItems = data,
                error => console.log(error),
                () => console.log('Get all Foods complete ' + this.foodItems ));
    }

    private subscribeToEvents():void{
        this._signalRService.connectionEstablished.subscribe(() => {
            this.canAddFood = true;
            this.getAllFood();
        });

        this._signalRService.foodchanged.subscribe(() => {
             this.getAllFood();
        });
    }
}