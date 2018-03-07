import { Component, NgZone, OnInit } from '@angular/core';

import { SignalRService } from '../../core/services/signalR.service';

@Component({
  selector: 'app-cpu-component',
  templateUrl: 'cpu.component.html'
})
export class CpuComponent implements OnInit {
  cpuValue: number;

  constructor(
    private _signalRService: SignalRService,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    this.subscribeToEvents();
  }

  private subscribeToEvents(): void {
    this._signalRService.newCpuValue.subscribe((cpuValue: number) => {
      this._ngZone.run(() => {
        this.cpuValue = cpuValue;
      });
    });
  }
}
