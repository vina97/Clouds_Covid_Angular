import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Info } from '../info.model';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CovidService } from '../covid.service';
import { formatDate } from '@angular/common';

//TODO: fix first add problem -> split in 2 functions: check (and add if not), retrieve-> less comlicated that now
//TODO: last week data as deltas
//TODO: country change imply recompute graphs

//TODO: today data in last 7

//possibility: store in covidservice current country/worldwide for titles/filtering


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  country: string;




  constructor(private route: ActivatedRoute, public covidService: CovidService) { }



  async ngOnInit(): Promise<void> {
    this.covidService.getCountries()
    this.country = this.route.snapshot.paramMap.get('name')
  }
}
