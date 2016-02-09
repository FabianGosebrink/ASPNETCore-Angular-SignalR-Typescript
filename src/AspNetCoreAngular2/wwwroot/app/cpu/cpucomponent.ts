import { Component, OnInit } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { SignalRService } from '../services/signalRService';

@Component({
    selector: 'cpu-component',
    templateUrl: 'app/cpu/cpu.component.html',
    directives: [CORE_DIRECTIVES]
})

export class CpuComponent implements OnInit {
    public cpuValue: number;

    constructor(private _signalRService: SignalRService) {

    }

    ngOnInit() {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this._signalRService.newCpuValue.subscribe((cpuValue: number) => {
            this.cpuValue = cpuValue;
        });
    }
}