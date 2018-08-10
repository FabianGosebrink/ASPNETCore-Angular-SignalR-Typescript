import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { CpuComponent } from './cpu/cpu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodComponent } from './food/food.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [],
  declarations: [
    ChatComponent,
    CpuComponent,
    DashboardComponent,
    FoodComponent
  ],
  providers: []
})
export class HomeModule {}
