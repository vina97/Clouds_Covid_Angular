import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {




  total: Info;
  byCountry: Info[];
  lastSeven: Array<Info>;
  fromApril: Array<Info>;

  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
    this.covidService.getSummary().toPromise().then(data => {
      this.total = new Info("Global", data["Global"]["TotalConfirmed"], data["Global"]["NewConfirmed"], data["Global"]["TotalRecovered"], data["Global"]["NewRecovered"], data["Global"]["TotalDeaths"], data["Global"]["NewDeaths"])
      this.pieChartLabels = ['Dead Cases', 'Recovered Cases', 'Active cases'];
      this.pieChartData = [this.total.totalDeath, this.total.totalRecovery, this.total.activeCases]
      //this.pieChartData.push(this.total.totalRecovery)
      //this.pieChartData.push(this.total.totalDeath)
      this.byCountry = new Array<Info>();
      for (let i = 0; i < data["Countries"].length; i++) {
        let elem = data["Countries"][i]
        this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
      }
    })

    this.covidService.getLastSeven().toPromise().then(data => {
      let sortable = []
      for (let elem in data) {
        sortable.push(data[elem])
      }
      sortable.sort(function (a, b) {
        var x = a["TotalConfirmed"]; var y = b["TotalConfirmed"];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      let newConf = []
      let newDeath = []
      let newRec = []
      let i = 7
      let labels = []
      for (let elem in sortable) {
        newConf.push(sortable[elem]["NewConfirmed"])
        newRec.push(sortable[elem]["NewRecovered"])
        newDeath.push(sortable[elem]["NewDeaths"])
        labels.push(formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)), 'dd MMM', 'en'))
        i = i - 1
      }
      //newConf.push(this.total["NewConfirmed"])
      //newRec.push(this.total["NewRecovered"])
      //newDeath.push(this.total["NewDeath"])
      labels.push(formatDate(new Date(new Date().getTime()), 'dd MMM', 'en'))
      this.barChartLabels = labels
      this.barChartData = [{ data: newDeath, label: "New Death" }, { data: newRec, label: "New Recovered" }, { data: newConf, label: "New Confirmed" }]
    })

    this.covidService.getFromApril().toPromise().then(data => {
      let sortable = []
      for (let elem in data) {
        sortable.push(data[elem])
      }


      let totalConf = []
      let totalDeath = []
      let totalRec = []
      let i = sortable.length
      let labels = []
      for (let elem in sortable) {
        totalConf.push(sortable[elem]["TotalConfirmed"])
        totalRec.push(sortable[elem]["TotalRecovered"])
        totalDeath.push(sortable[elem]["TotalDeaths"])
        labels.push(formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)), 'dd MMM', 'en'))
        i = i - 1
      }
      this.lineChartLabels = labels;
      totalConf.sort(function (a, b) {
        var x = a; var y = b;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      totalDeath.sort(function (a, b) {
        var x = a; var y = b;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      totalRec.sort(function (a, b) {
        var x = a; var y = b;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      this.lineChartData = [{ data: totalDeath, label: "Total Deaths" }, { data: totalRec, label: "Total Recoveries" }, { data: totalConf, label: "Total Confirmed" }]
    }

    )

  }



  getLastSeven() {
    //this.covidService.getLastSeven().subscribe(result => this.lastSeven=result)  
  }

  getFromApril() {
    //this.covidService.getFromApril().subscribe(result => this.fromApril=result)  
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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

  public lineChartData: ChartDataSets[] = []
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType = 'line';

}
