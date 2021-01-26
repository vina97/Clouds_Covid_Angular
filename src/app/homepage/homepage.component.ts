import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';

//TODO: proper page scroll (check offset/ evaluate nav global)

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
    console.log(form.checkValidity())
    if (form.checkValidity()) {
      let name = form.elements["uname"].value
      let psw = form.elements["psw"].value
      console.log(name, psw)
      this.covidService.signup(name, psw)
    }

  }


}