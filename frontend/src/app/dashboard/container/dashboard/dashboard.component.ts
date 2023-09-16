import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../../models/chat-message.model';
import { FoodItem } from '../../../models/foodItem.model';
import { FoodDataService } from '../../../services/food-data.service';
import { SignalRService } from '../../../services/signalR.service';
import { ChatComponent } from '../../presentational/chat/chat.component';
import { CpuComponent } from '../../presentational/cpu/cpu.component';
import { FoodComponent } from '../../presentational/food/food.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CpuComponent, FoodComponent, ChatComponent, AsyncPipe, NgIf],
})
export class DashboardComponent implements OnInit {
  private readonly signalRService = inject(SignalRService);
  private readonly foodDataService = inject(FoodDataService);

  cpuValue$ = this.signalRService.newCpuValue$;
  signalrConnectionEstablished$ = this.signalRService.connectionEstablished$;
  foodItems$: Observable<FoodItem[]>;
  chatmessages = [];

  ngOnInit() {
    this.signalRService.foodChanged$.subscribe(() => this.getFoodData());

    this.signalRService.messageReceived$.subscribe((message) => {
      this.chatmessages = [...this.chatmessages, message];
    });

    this.getFoodData();
  }

  saveFood(item: FoodItem) {
    if (item.id) {
      this.foodDataService
        .updateFood(item)
        .subscribe(() => console.log('food updated'));
    } else {
      this.foodDataService
        .addFood(item.itemName)
        .subscribe(() => console.log('food added'));
    }
  }

  deleteFood(item: FoodItem) {
    if (!confirm('Really delete?')) {
      return;
    }

    this.foodDataService
      .deleteFood(item.id)
      .subscribe(() => console.log('food deleted'));
  }

  sendChat(message: ChatMessage) {
    this.signalRService.sendChatMessage(message);
  }

  private getFoodData() {
    this.foodItems$ = this.foodDataService.getAllFood();
  }
}
