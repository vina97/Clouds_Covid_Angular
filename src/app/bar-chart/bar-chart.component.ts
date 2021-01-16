import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

//TODO: CSS to fix size

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
        }
      }]
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = []
  country: string;


  constructor(private route: ActivatedRoute, public covidService: CovidService) { }

  ngOnInit(): void {

    let i = 7
    let labels = []
    while (i > 0) {
      labels.push(formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)), 'dd MMM', 'en'))
      i = i - 1
    }
    labels.push(formatDate(new Date(new Date().getTime()), 'dd MMM', 'en'))
    this.barChartLabels = labels
    this.barChartData = [{ data: this.covidService.newDeath, label: "New Death" }, { data: this.covidService.newRec, label: "New Recovered" }, { data: this.covidService.newConf, label: "New Confirmed" }]

  }

}
