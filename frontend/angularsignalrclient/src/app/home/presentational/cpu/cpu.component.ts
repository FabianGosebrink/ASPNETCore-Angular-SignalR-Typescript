import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css']
})
export class CpuComponent implements OnChanges {
  @Input() cpuValue: number;

  view: any[] = [400, 400];
  data;

  colorScheme = {
    domain: ['#5AA454']
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cpuValue) {
      this.renderChart(changes.cpuValue.currentValue);
    }
  }

  renderChart(cpuValue: number) {
    this.data = {
      name: 'CPU',
      value: cpuValue || 0
    };
  }
}
