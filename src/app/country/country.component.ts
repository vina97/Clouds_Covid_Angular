import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CovidService } from '../covid.service';
import { formatDate } from '@angular/common';

//TODO: fix first add problem -> split in 2 functions: check (and add if not), retrieve-> less comlicated that now
//TODO: summary retrival fix

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {


  constructor(private route: ActivatedRoute, public covidService: CovidService) { }



  async ngOnInit(): Promise<void> {
    this.covidService.setAllInfoCountry(this.route.snapshot.paramMap.get('name'))
  }
}
