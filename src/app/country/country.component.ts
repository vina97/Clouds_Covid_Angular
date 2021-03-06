import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../covid.service';

//TODO: highlight not filled form

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

  login() {
    let form = document.forms["loginfo"]
    if (form.checkValidity()) {
      let name = form.elements["uname"].value
      let psw = form.elements["psw"].value
      this.covidService.loginWithPsw(name, psw)
    }
  }

  signin() {
    let form = document.forms["loginfo"]
    if (form.checkValidity()) {
      let name = form.elements["uname"].value
      let psw = form.elements["psw"].value
      this.covidService.signup(name, psw)
    }

  }

}
