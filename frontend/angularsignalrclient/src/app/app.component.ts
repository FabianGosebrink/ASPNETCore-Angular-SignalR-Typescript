import { Component } from '@angular/core';
import { SignalRService } from './core/services/signalR.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularsignalrclient';

  constructor(private readonly signalRService: SignalRService) {}
}
