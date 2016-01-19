import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../common/signalRService';
import { IFoodItem } from '../models/IFoodItem';
import {FoodComponent} from '../food/foodcomponent';

@Component({
    selector: 'home',
    providers: [DataService, SignalRService],
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES, FoodComponent]
})

export class HomeComponent implements OnInit {

    public message: string;

    constructor(private _dataService: DataService, private _signalRService: SignalRService) {
        this.message = "Hello from HomeComponent constructor";
    }

    ngOnInit() {
        //...
    }
}
