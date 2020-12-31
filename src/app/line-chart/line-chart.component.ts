import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


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
  };

  public lineChartLegend = true;
  public lineChartType = 'line';
  country: string;


  constructor(private route: ActivatedRoute, public covidService: CovidService) { }

  ngOnInit(): void {

    let page = this.route.snapshot["url"][0]["path"]
    if (page == "home") {
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

    else {
      this.country = this.route.snapshot.paramMap.get('name')
      this.covidService.getAllFromCountry(this.country).subscribe(data => {
        let sortable = []
        for (let elem in data) {
          //avoid problems with countries like france
          if (data[elem]["Province"] == "")
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
  }

}
