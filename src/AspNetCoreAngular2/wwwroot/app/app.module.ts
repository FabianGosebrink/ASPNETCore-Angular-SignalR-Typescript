import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { routing, appRoutingProviders } from './app.routes';
import { HttpModule, JsonpModule } from '@angular/http';
//import { DashboardModule } from './components/dashboard/dashboard.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { FormsModule }   from '@angular/forms';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ChatComponent } from './components/chat/chatcomponent';
import { CpuComponent } from './components/cpu/cpucomponent';
import { FoodComponent } from './components/food/foodcomponent';

import { SignalRService } from './services/signalRService';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        JsonpModule,
       // DashboardModule,
        FormsModule,
        CommonModule
    ],

    declarations: [AppComponent, AboutComponent, DashboardComponent, ChatComponent, CpuComponent, FoodComponent],

    providers: [
        appRoutingProviders,
        {provide: LocationStrategy, useClass: HashLocationStrategy },
        SignalRService
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }