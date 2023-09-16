import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css'],
  standalone: true,
  imports: [NgxChartsModule],
})
export class CpuComponent implements OnChanges {
  @Input() cpuValue: number;

  view: number[] = [400, 400];
  data: { name: string; value: number }[] = [];

  colorScheme = {
    domain: ['#5AA454'],
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cpuValue) {
      this.renderChart(changes.cpuValue.currentValue);
    }
  }

  renderChart(cpuValue: number) {
    this.data = [
      {
        name: 'CPU',
        value: cpuValue || 0,
      },
    ];
  }
}
