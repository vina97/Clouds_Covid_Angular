import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';

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

}
