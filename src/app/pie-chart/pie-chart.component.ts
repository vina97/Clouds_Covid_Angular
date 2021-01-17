import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { News } from '../news.model';

//*
//TODO: summary retrival for country page
//*

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  public country: string
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active cases'];
  public pieChartData: number[] = [5, 3, 2]
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(223, 71, 89,0.5)', 'rgba(91, 192, 222,0.5)', 'rgba(240, 173, 78,0.5)'],
    },
  ];

  public total: Info = new Info("test", 0, 0, 0, 0, 0, 0)


  constructor(private route: ActivatedRoute, public covidService: CovidService) { }

  async ngOnInit(): Promise<void> {

    let page = this.route.snapshot["url"][0]["path"]
    if (page == "home") {
      this.country = "WorldWide"
      this.pieChartLabels = ['Dead Cases', 'Recovered Cases', 'Active cases'];
    }

    else if (page == "country") {
      this.country = this.route.snapshot.paramMap.get('name')
      this.pieChartLabels = ['Dead Cases', 'Recovered Cases', 'Active cases'];

    }

  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


}
