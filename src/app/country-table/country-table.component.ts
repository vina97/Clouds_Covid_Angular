import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Info } from '../info.model';

//TODO: CSS to fix size

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html',
  styleUrls: ['./country-table.component.css']
})
export class CountryTableComponent implements OnInit {

  public byCountry: Info[]
  sorted: String
  up: Boolean
  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
    this.covidService.getSummary().toPromise().then(data => {
      this.byCountry = new Array<Info>();
      for (let i = 0; i < data["Countries"].length; i++) {
        let elem = data["Countries"][i]
        this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
      }
      this.countrySort()
    })
  }

  public numSort(id) {
    let next = document.getElementById("countryUp")
    let current = document.getElementsByClassName("highlight").item(0)
    current.classList.remove("highlight")
    if (this.sorted == id) {
      this.up = !this.up
      this.byCountry.reverse()
      if (this.up == true)
        next = document.getElementById(id + "Down")
      else
        next = document.getElementById(id + "Up")
    }
    else {
      this.byCountry.sort((a, b) => this.numSorter(a[id], b[id]))
      next = document.getElementById(id + "Down")
      this.up = true
    }
    this.sorted = id
    next.classList.add("highlight")
  }

  public countrySort() {
    let next = document.getElementById("countryUp")

    let current = document.getElementsByClassName("highlight").item(0)
    current.classList.remove("highlight")
    if (this.sorted == "Country") {
      this.up = !this.up

      this.byCountry.reverse()
      if (this.up == true)
        next = document.getElementById("countryDown")
      else
        next = document.getElementById("countryUp")
    }
    else {
      this.byCountry.sort((a, b) => this.nameSorter(a["name"], b["name"]))
      next = document.getElementById("countryDown")
      this.up = true

    }
    next.classList.add("highlight")
    this.sorted = "Country"

  }


  public nameSorter(a, b) {
    if (a < b)
      return -1
    else
      return 1
  }

  public numSorter(a, b) {
    return a - b
  }

}
