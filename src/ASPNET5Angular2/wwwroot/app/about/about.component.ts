import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'about',
    templateUrl: 'app/about/about.component.html'
})

export class AboutComponent implements OnInit {

    public message: string;

    constructor() { }

    ngOnInit() {
        //... 
    }
}
