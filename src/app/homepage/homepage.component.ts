import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';


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
        console.log(elem)
        this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
      }
      console.log(this.byCountry)
    })
    //console.log(d["Global:"])
    //console.log(this.total)
    //this.getLastSeven()
    //this.getFromApril()
  }

  getGeneralInfo() {


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

}
