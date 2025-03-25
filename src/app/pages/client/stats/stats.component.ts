import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-stats',
    imports: [ChartModule],
    templateUrl: './stats.component.html',
    styleUrl: './stats.component.css'
})
export class StatsComponent {

  basicData: any;


  ngOnInit(): void {
    

    this.basicData = {
      labels: ['users', 'services', 'proposals', 'accepted proposal'],
      datasets: [
          {
              label: 'Sales',
              data: [540, 325, 702, 620],
              backgroundColor: [
                  'rgba(249, 115, 22, 0.2)',
                  'rgba(6, 182, 212, 0.2)',
                  'rgb(107, 114, 128, 0.2)',
                  'rgba(139, 92, 246, 0.2)',
              ],
              borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
              borderWidth: 1,
          },
      ],
  };

  }
}
