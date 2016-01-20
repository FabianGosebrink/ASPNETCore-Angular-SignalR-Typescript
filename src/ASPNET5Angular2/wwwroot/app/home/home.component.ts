import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../services/signalRService';
import { FoodComponent } from '../food/foodcomponent';

@Component({
    selector: 'home',
    providers: [DataService, SignalRService],
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES, FoodComponent]
})

export class HomeComponent {

    public message: string;

    constructor() {
        this.message = "Hello from HomeComponent constructor";
    }
}
