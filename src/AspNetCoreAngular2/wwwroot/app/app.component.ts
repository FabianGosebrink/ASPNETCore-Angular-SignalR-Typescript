import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AboutComponent} from './components/about/about.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['app/app.component.css']
})

@RouteConfig([
    { path: '/dashboard', name: 'Dashboard', component: DashboardComponent, useAsDefault: true },
    { path: '/about', name: 'About', component: AboutComponent },
])

export class AppComponent { }