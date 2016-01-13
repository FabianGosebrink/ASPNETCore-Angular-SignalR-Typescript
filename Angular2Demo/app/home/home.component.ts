import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import { CORE_DIRECTIVES } from 'angular2/common';
import {DataService } from '../services/PersonDataService';
import {Http, Response} from 'angular2/http';

@Component({
    selector: 'home',
    providers: [DataService],
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES]
})

export class HomeComponent implements OnInit {
    public foodItems: any;

    constructor(private _router: Router, private _dataService: DataService) { }

    ngOnInit() {
        this.getAllFood();
    }

    private getAllFood(): void {
        this._dataService
            .GetAllFood()
            .subscribe((data) => {
                this.foodItems = data;
            },
            (response) => {
                console.log(response)
            }, () => console.log('Call complete'));
    }
}
