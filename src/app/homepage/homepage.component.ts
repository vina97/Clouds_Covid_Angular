import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';

//TODO: refactor code for subscription, 
//TODO: login in other way
//TODO: make all feel like loading when still no data
//TODO: User icon when logged
//TODO: add icons to make clear the sorting


//TODO: today data in last 7


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public byCountry: Info[];


  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
    this.covidService.getCountries()

    this.covidService.getSummary().toPromise().then(data => {

      this.byCountry = new Array<Info>();
      for (let i = 0; i < data["Countries"].length; i++) {
        let elem = data["Countries"][i]
        this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
      }
    })


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



}