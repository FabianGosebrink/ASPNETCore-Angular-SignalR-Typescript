import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'about',
    templateUrl: 'app/about/about.component.html'
})

export class AboutComponent implements OnInit {

    public message: string;

    constructor(private _router: Router) { }

    ngOnInit() {
        //... 
    }

    gotoDetail() {
        //this._router.navigate([`/${Routes.detail.as}`, { id: character.id }]);
    }

    getcharacters() {
       
    }
}
