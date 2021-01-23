import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { formatDate } from '@angular/common';

//TODO: login in other way
//TODO: User icon when logged -> set with CSS

//TODO: proper page scroll (check offset/ evaluate nav global)
//TODO: fix CSS size of graphs

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {



  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
    this.covidService.current = "WorldWide"
    this.covidService.setAllInfoHomePage()
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  displayModal() {
    document.getElementById('id01').style.display = 'block'
  }


}