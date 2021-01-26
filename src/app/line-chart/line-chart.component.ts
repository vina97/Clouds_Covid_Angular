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

    this.lineChartLabels = this.covidService.dayslabels;
    this.lineChartData = [{ data: this.covidService.totalDeath, label: "Total Deaths" }, { data: this.covidService.totalRec, label: "Total Recoveries" }, { data: this.covidService.totalConf, label: "Total Confirmed" }]

  }
}
