import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
      this.covidService.getSummary().toPromise().then(data => {
        this.total = new Info("Global", data["Global"]["TotalConfirmed"], data["Global"]["NewConfirmed"], data["Global"]["TotalRecovered"], data["Global"]["NewRecovered"], data["Global"]["TotalDeaths"], data["Global"]["NewDeaths"])
        this.pieChartLabels = ['Dead Cases', 'Recovered Cases', 'Active cases'];
        this.pieChartData = [this.total.totalDeath, this.total.totalRecovery, this.total.activeCases]
        //this.pieChartData.push(this.total.totalRecovery)
        //this.pieChartData.push(this.total.totalDeath)

        /*this.byCountry = new Array<Info>();
        for (let i = 0; i < data["Countries"].length; i++) {
          let elem = data["Countries"][i]
          this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
        }*/
      })
    }
    else if (page == "country") {
      this.country = this.route.snapshot.paramMap.get('name')
        ; (await this.covidService.getCountryInfoDB(this.country)).subscribe((res) => {
          this.total = new Info(res.data()["name"], res.data()["totalCases"], res.data()["newCases"], res.data()["totalRecovery"], res.data()["newRecovery"], res.data()["totalDeath"], res.data()["newDeath"])
          this.pieChartData = [this.total.totalDeath, this.total.totalRecovery, this.total.totalCases]
        })
    }

  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


}
