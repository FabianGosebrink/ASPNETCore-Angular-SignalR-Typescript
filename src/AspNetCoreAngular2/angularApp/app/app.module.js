var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataService } from './services/foodDataService';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { HttpModule, JsonpModule } from '@angular/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';
import { FoodComponent } from './components/food/food.component';
import { ChatComponent } from './components/chat/chat.component';
import { CpuComponent } from './components/cpu/cpu.component';
import { SignalRService } from './services/signalRService';
import { FormsModule } from '@angular/forms';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
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
            SignalRService,
            DataService
        ],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map