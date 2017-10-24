import { Component, NgZone, OnInit } from '@angular/core';

import { FoodDataService } from '../../core/services/food-data.service';
import { SignalRService } from '../../core/services/signalR.service';
import { FoodItem } from '../../models/foodItem.model';

@Component({
    selector: 'app-food-component',
    templateUrl: 'food.component.html'
})

export class FoodComponent implements OnInit {
    foodItems: FoodItem[];
    currentFoodItem: FoodItem;
    canAddFood: Boolean;

    constructor(private _dataService: FoodDataService,
        private _signalRService: SignalRService,
        private _ngZone: NgZone) {

        this.canAddFood = _signalRService.connectionExists;
        this.currentFoodItem = new FoodItem();
        this.foodItems = [];
    }

    ngOnInit() {
        this.subscribeToEvents();
        this.getAllFood();
    }

    saveFood() {
        if (this.currentFoodItem.id) {
            this._dataService
                .updateFood(this.currentFoodItem.id, this.currentFoodItem)
                .subscribe(data => {
                    this.currentFoodItem = new FoodItem();
                }, error => {
                    console.log(error)
                },
                () => console.log('Update complete'));
        } else {
            this._dataService
                .addFood(this.currentFoodItem.itemName)
                .subscribe(data => {
                    this.currentFoodItem = new FoodItem();
                }, error => {
                    console.log(error)
                },
                () => console.log('Added complete'));
        }
    }

    deleteFoodItem(foodItem: FoodItem) {
        this._dataService.deleteFood(foodItem.id)
            .subscribe(
            response => {
                // this._signalRService.FoodDeleted();
            }, error => {
                console.log(error);
            }, () => {
                console.log('Deleted complete');
            });
    }

    setFoodItemToEdit(foodItem: FoodItem) {
        this.currentFoodItem = foodItem;
    }

    private getAllFood(): void {
        this._ngZone.run(() => {
            this._dataService
                .getAllFood()
                .subscribe(
                data => {
                    this.foodItems = data;
                },
                error => console.log(error),
                () => console.log('Get all Foods complete ' + JSON.stringify(this.foodItems)));
        });

    }

    private subscribeToEvents(): void {
        this._signalRService.connectionEstablished.subscribe(() => {
            this.canAddFood = true;
        });

        this._signalRService.foodchanged.subscribe((data: any) => {
            this.getAllFood();
        });
    }
}
