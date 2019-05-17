import { Component, OnInit } from '@angular/core';
import { FoodDataService } from '@app/core/services/food-data.service';
import { SignalRService } from '@app/core/services/signalR.service';
import { FoodItem } from '@app/models/foodItem.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cpuValue$: Observable<number>;
  signalrConnectionEstablished$: Observable<boolean>;
  foodItems$: Observable<FoodItem[]>;

  constructor(
    private readonly signalRService: SignalRService,
    private foodDataService: FoodDataService
  ) {}

  ngOnInit() {
    this.cpuValue$ = this.signalRService.newCpuValue$;
    this.signalrConnectionEstablished$ = this.signalRService.connectionEstablished$;
    this.foodItems$ = this.foodDataService.getAllFood();
  }

  saveFood(item: FoodItem) {
    if (item.id) {
      this.foodDataService
        .updateFood(item)
        .subscribe(() => this.foodDataService.getAllFood());
    } else {
      this.foodDataService
        .addFood(item.itemName)
        .subscribe(() => this.foodDataService.getAllFood());
    }
  }
}
