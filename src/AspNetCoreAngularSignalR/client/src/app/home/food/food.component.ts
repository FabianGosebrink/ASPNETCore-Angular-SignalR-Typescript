import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FoodDataService } from '../../core/services/food-data.service';
import { SignalRService } from '../../core/services/signalR.service';
import { FoodItem } from '../../models/foodItem.model';

@Component({
  selector: 'app-food-component',
  templateUrl: 'food.component.html'
})
export class FoodComponent implements OnInit {
  foodItems: Observable<FoodItem[]>;
  currentFoodItem: FoodItem = new FoodItem();
  canAddFood: boolean;

  constructor(
    private dataService: FoodDataService,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
    this.subscribeToEvents();
    this.signalRService.connectionEstablished.subscribe(() => {
      this.canAddFood = true;
      this.getAllFood();
    });
  }

  saveFood() {
    if (this.currentFoodItem.id) {
      this.dataService
        .updateFood(this.currentFoodItem.id, this.currentFoodItem)
        .subscribe(
          data => {
            this.currentFoodItem = new FoodItem();
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.dataService.addFood(this.currentFoodItem.itemName).subscribe(
        data => {
          this.currentFoodItem = new FoodItem();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  deleteFoodItem(foodItem: FoodItem) {
    this.dataService.deleteFood(foodItem.id).subscribe(
      response => {
        // this._signalRService.FoodDeleted();
      },
      error => {
        console.log(error);
      }
    );
  }

  setFoodItemToEdit(foodItem: FoodItem) {
    this.currentFoodItem = foodItem;
  }

  private getAllFood(): void {
    this.foodItems = this.dataService.getAllFood();
  }

  private subscribeToEvents(): void {
    this.signalRService.foodchanged.subscribe((data: any) => {
      this.getAllFood();
    });
  }
}
