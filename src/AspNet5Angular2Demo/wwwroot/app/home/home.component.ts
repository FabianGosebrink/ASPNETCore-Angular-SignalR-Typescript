import { Component, OnInit } from 'angular2/core';
import { Router} from 'angular2/router';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/foodDataService';
import { IFoodItem } from '../models/IFoodItem';
import { Http, Response } from 'angular2/http';
import {FoodList} from '../food/foodList';
import {FoodForm} from '../food/foodForm';

@Component({
    selector: 'home',
    providers: [DataService],
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES, FoodList, FoodForm]
})

export class HomeComponent implements OnInit {

    public foodItems: IFoodItem[];
    public message: string;

    constructor(private _router: Router, private _dataService: DataService) { 
        this.message = "Hello from HomeComponent constructor";
    }

    ngOnInit() {
        this.getAllFood();
    }
    
    public foodListModified(addedFood: IFoodItem) {
         this.getAllFood();
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe(
            data => this.foodItems = data,
            err => console.log(err),
            () => console.log('Random Quote Complete'));
    }
}
