import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CovidService } from '../covid.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  public country = "";
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


  public total: Info = new Info("test", 0, 0, 0, 0, 0, 0)
  public lastSeven: Array<Info>;
  public fromApril: Array<Info>;



  constructor(private route: ActivatedRoute, public covidService: CovidService) { }



  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('name')
    this.covidService.getCountryInfoDB(this.country).subscribe((res) => {
      this.total = new Info(res.data()["name"], res.data()["totalCases"], res.data()["newCases"], res.data()["totalRecovery"], res.data()["newRecovery"], res.data()["totalDeath"], res.data()["newDeath"])
      this.pieChartData = [this.total.totalDeath, this.total.totalRecovery, this.total.totalCases]
    })

    this.covidService.getLastSevenFromCountry(this.country).subscribe((data) => {
      console.log(data)
      let sortable = []
      for (let elem in data) {
        sortable.push(data[elem])
      }
      sortable.sort(function (a, b) {
        var x = a["Confirmed"]; var y = b["Confirmed"];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      let newConf = []
      let newDeath = []
      let newRec = []
      let i = 7
      let labels = []
      for (let elem in sortable) {
        newConf.push(sortable[elem]["Confirmed"])
        newRec.push(sortable[elem]["Recovered"])
        newDeath.push(sortable[elem]["Deaths"])
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

    this.covidService.getAllFromCountry(this.country).subscribe(data => {
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
        totalConf.push(sortable[elem]["Confirmed"])
        totalRec.push(sortable[elem]["Recovered"])
        totalDeath.push(sortable[elem]["Deaths"])
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

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
