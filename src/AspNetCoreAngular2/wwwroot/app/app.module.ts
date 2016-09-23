import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { routing, appRoutingProviders } from './app.routes';
import { HttpModule, JsonpModule } from '@angular/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { FoodComponent } from './components/food/food.component';
import { ChatComponent } from './components/chat/chat.component';
import { CpuComponent } from './components/cpu/cpu.component';
import { SignalRService } from './services/signalRService';
import { FormsModule }   from '@angular/forms';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        JsonpModule,
        FormsModule
    ],

    declarations: [
        AppComponent,
        DashboardComponent,
        AboutComponent,
        FoodComponent,
        ChatComponent,
        CpuComponent
    ],


    providers: [
        appRoutingProviders,
        SignalRService
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }