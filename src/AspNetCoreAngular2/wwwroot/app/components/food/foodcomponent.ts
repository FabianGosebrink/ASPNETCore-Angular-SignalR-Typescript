import { Component, OnInit, NgZone} from '@angular/core';
import { DataService } from '../../services/foodDataService';
import { SignalRService } from '../../services/signalRService';
import { FoodItem } from '../../models/FoodItem';

@Component({
    selector: 'food-component',
    providers: [DataService],
    template: require('./food.component.html')
})

export class FoodComponent implements OnInit {
    public foodItems: FoodItem[];
    public currentFoodItem: FoodItem;
    public canAddFood: Boolean;

    constructor(private _dataService: DataService, private _signalRService: SignalRService, private _ngZone: NgZone) {
        this.canAddFood = _signalRService.connectionExists;
        this.currentFoodItem = new FoodItem();
        this.foodItems = [];
    }

    public ngOnInit() {
        this.subscribeToEvents();
        this.getAllFood();
    }

    public saveFood() {
        if (this.currentFoodItem.id) {
            this._dataService
                .Update(this.currentFoodItem.id, this.currentFoodItem)
                .subscribe(data => {
                    this.currentFoodItem = new FoodItem();
                }, error => {
                    console.log(error)
                },
                () => console.log('Update complete'));
        } else {
            this._dataService
                .AddFood(this.currentFoodItem.itemName)
                .subscribe(data => {
                    this.currentFoodItem = new FoodItem();
                }, error => {
                    console.log(error)
                },
                () => console.log('Added complete'));
        }
    }

    public deleteFoodItem(foodItem: FoodItem) {
        this._dataService.DeleteFood(foodItem.id)
            .subscribe(
            response => {
                // this._signalRService.FoodDeleted();
            }, error => {
                console.log(error);
            }, () => {
                console.log('Deleted complete');
            });
    }

    public setFoodItemToEdit(foodItem: FoodItem) {
        this.currentFoodItem = foodItem;
    }

    private getAllFood(): void {
        this._ngZone.run(() => {
            this._dataService
                .GetAllFood()
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
            //this.getAllFood();
        });

        this._signalRService.foodchanged.subscribe((data) => {
            this.getAllFood();
        });
    }
}