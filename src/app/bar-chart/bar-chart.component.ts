import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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

    let page = this.route.snapshot["url"][0]["path"]
    if (page == "home") {
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
    }
    else {
      this.country = this.route.snapshot.paramMap.get('name')
      //get last 8, then compute deltas to get the changes and not the total
      this.covidService.getLastSevenFromCountry(this.country).subscribe((data) => {
        let sortable = []
        for (let elem in data) {
          if (data[elem]["Province"] == "")
            sortable.push(data[elem])
        }
        console.log(sortable)

        sortable.sort(function (a, b) {
          var x = a["Confirmed"]; var y = b["Confirmed"];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
        let newConf = []
        let newDeath = []
        let newRec = []
        let i = 7
        let labels = []

        let len = sortable.length
        //TODO: get difference, not total
        for (let j = 1; j < len; j++) {
          newConf.push(sortable[j]["Confirmed"] - sortable[j - 1]["Confirmed"])
          newRec.push(sortable[j]["Recovered"] - sortable[j - 1]["Recovered"])
          newDeath.push(sortable[j]["Deaths"] - sortable[j - 1]["Deaths"])
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
    }
  }

}
