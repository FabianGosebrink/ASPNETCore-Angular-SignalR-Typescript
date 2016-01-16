import { Component, OnInit } from 'angular2/core';
import { Router} from 'angular2/router';
import { CORE_DIRECTIVES } from 'angular2/common';
import { DataService } from '../services/PersonDataService';
import { IFoodItem } from '../models/IFoodItem';
import { Http, Response } from 'angular2/http';

@Component({
    selector: 'home',
    providers: [DataService],
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES]
})

export class HomeComponent implements OnInit {

    public foodItems: app.models.IFoodItem[];

    constructor(private _router: Router, private _dataService: DataService) { }

    ngOnInit() {
        //...
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe((data) => {
                console.log("data: " + data)
                this.foodItems = data;
            },
            (response) => {
                console.log(response)
            }, () => console.log('Call complete'));
    }
}
