import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../covid.service';

//TODO: fix comment display (CSS) + delete possibility
//TODO: evaluate no profile picture in comments to avoid get rejected

@Component({
  selector: 'app-newspage',
  templateUrl: './newspage.component.html',
  styleUrls: ['./newspage.component.css']
})
export class NewspageComponent implements OnInit {

  constructor(private route: ActivatedRoute, public covidService: CovidService) { }

  ngOnInit(): void {
    this.covidService.getCountries()
    if (this.covidService.newsDetail.id == "")
      this.covidService.setCurrentNews(this.route.snapshot.paramMap.get('id'))
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
