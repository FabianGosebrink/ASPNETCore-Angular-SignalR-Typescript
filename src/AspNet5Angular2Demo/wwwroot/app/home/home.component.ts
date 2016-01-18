import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/foodDataService';
import { SignalRService } from '../common/signalRService';
import { IFoodItem } from '../models/IFoodItem';
import {FoodList} from '../food/foodList';
import {FoodForm} from '../food/foodForm';

@Component({
    selector: 'home',
    providers: [DataService, SignalRService],
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES, FoodList, FoodForm]
})

export class HomeComponent implements OnInit {

    public foodItems: IFoodItem[];
    public message: string;

    constructor(private _dataService: DataService,
        private _signalRService: SignalRService) {
        this.message = "Hello from HomeComponent constructor";
    }

    ngOnInit() {
        this.getAllFood();
        
        this._signalRService.foodchanged.subscribe(() => {
            this.foodListModified();
        });
    }

    public foodListModified() {
        this.getAllFood();
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe(
            data => this.foodItems = data,
            err => console.log(err),
            () => console.log('Get all Foods complete'));
    }
}
