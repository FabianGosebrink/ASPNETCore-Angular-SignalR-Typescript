import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  message: string;

  constructor() {
    this.message = 'Hello from HomeComponent constructor';
  }
}
