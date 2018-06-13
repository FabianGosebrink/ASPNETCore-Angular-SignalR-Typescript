import { Component, NgZone, OnInit } from '@angular/core';
import { SignalRService } from '../../core/services/signalR.service';

@Component({
  selector: 'app-cpu-component',
  templateUrl: 'cpu.component.html'
})
export class CpuComponent implements OnInit {
  cpuValue = 0;

  constructor(private signalRService: SignalRService, private ngZone: NgZone) {}

  ngOnInit() {
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this.signalRService.newCpuValue.subscribe((cpuValue: number) => {
      this.ngZone.run(() => {
        this.cpuValue = cpuValue;
      });
    });
  }
}
