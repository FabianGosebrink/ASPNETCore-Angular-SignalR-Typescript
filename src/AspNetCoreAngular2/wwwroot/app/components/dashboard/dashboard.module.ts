import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { DashboardComponent } from './dashboard.component';
import { ChatComponent } from '../chat/chatcomponent';
import { CpuComponent } from '../cpu/cpucomponent';
import { FoodComponent } from '../food/foodcomponent';
import { FormsModule }   from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        DashboardComponent, ChatComponent, CpuComponent, FoodComponent
    ]
})
export class DashboardModule { }