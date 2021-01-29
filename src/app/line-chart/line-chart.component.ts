import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  public lineChartData: ChartDataSets[] = []
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    maintainAspectRatio: false
  };

  public lineChartLegend = true;
  public lineChartType = 'line';
  country: string;


  constructor(public covidService: CovidService) { }

  ngOnInit(): void {


  }
}
