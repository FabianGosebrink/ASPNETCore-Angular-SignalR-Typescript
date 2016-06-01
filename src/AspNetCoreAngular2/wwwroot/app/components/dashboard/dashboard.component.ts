import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { FoodComponent } from '../food/foodcomponent';
import { ChatComponent } from '../chat/chatComponent';
import { CpuComponent } from '../cpu/cpuComponent';

@Component({
    selector: 'dashboard',
    templateUrl: 'app/components/dashboard/dashboard.component.html',
    directives: [CORE_DIRECTIVES, FoodComponent, ChatComponent, CpuComponent]
})

export class DashboardComponent {

    public message: string;

    constructor() {
        this.message = 'Hello from HomeComponent constructor';
    }
}
