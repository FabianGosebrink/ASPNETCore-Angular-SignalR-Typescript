import { Component, OnInit, NgZone } from '@angular/core';
import { SignalRService } from '../../services/signalRService';

@Component({
    selector: 'cpu-component',
    templateUrl: 'cpu.component.html'
})

export class CpuComponent implements OnInit {
    public cpuValue: number;

    constructor(private _signalRService: SignalRService, private _ngZone: NgZone) {

    }

    public ngOnInit() {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this._signalRService.newCpuValue.subscribe((cpuValue: number) => {
            this._ngZone.run(() => {
                this.cpuValue = cpuValue
            });
        });
    }
}