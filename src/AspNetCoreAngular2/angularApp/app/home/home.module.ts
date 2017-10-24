import { FormsModule } from '@angular/forms';
import { FoodComponent } from './food/food.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CpuComponent } from './cpu/cpu.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [],
    declarations: [
        ChatComponent,
        CpuComponent,
        DashboardComponent,
        FoodComponent
    ],
    providers: [],
})

export class HomeModule { }
