import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { routing, appRoutingProviders } from './app.routes';
import { HttpModule, JsonpModule } from '@angular/http';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { AboutComponent } from './components/about/about.component';
import { FormsModule }   from '@angular/forms';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';

import { SignalRService } from './services/signalRService';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        JsonpModule,
        DashboardModule,
        FormsModule,
        CommonModule
    ],

    //declarations: [AppComponent, AboutComponent, DashboardComponent, ChatComponent, CpuComponent, FoodComponent],
    declarations: [AppComponent, AboutComponent],

    providers: [
        appRoutingProviders,
        {provide: LocationStrategy, useClass: HashLocationStrategy },
        SignalRService
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }