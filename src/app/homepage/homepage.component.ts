import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';

//TODO: refactor code for subscription, 
//TODO: login in other way
//TODO: make all feel like loading when still no data
//TODO: User icon when logged -> set with CSS

//TODO: proper page scroll (check offset/ evaluate nav global)
//TODO: fix CSS size of graphs

//TODO: all data in service, components only get from there


//TODO: today data in last 7


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {



  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
    this.covidService.setAllInfoHomePage()
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