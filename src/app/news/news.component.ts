import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../news.model';
import * as $ from "jquery";
import { AngularFireStorage } from '@angular/fire/storage';


//TODO: proper modal hide
//TODO: add news as ngModel + ngSubmit + reset to undefined
//TODO: handle news edit -> video
//TODO: news indexing + id -> almost
//TODO: properly fix CSS modal
//TODO: show upload file progress
//TODO: Proper message when no news

//TODO: scroll up page when changing


//TODO: author icon too in the news

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news: Array<News>
  ref: any;
  task: any;
  uploadProgress: any;
  downloadURL: any;
  f: any;

  constructor(public covidService: CovidService, private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.covidService.getCountries()
    this.covidService.filterNews(this.covidService.current)


  }

  displayModal() {
    document.getElementById('id01').style.display = 'block'
  }



  findFile(event) {
    this.f = event.target.files.item(0)
  }



  public upload(): void {
    let f = document.forms["news"]
    let u = this.covidService.getUser()

    if (this.f !== undefined) {
      let n = {
        image: "",
        title: f.elements["title"].value,
        text: f.elements["description"].value,
        author: u.name,
        country: f.elements["country"].value,
        date: new Date().toISOString().split("T")[0],
        file: "",
        id: "",
        uid: u.uid,
        progress: 0,
      }
      this.covidService.addNewsWithFile(n, this.f).subscribe(
        percentage => {
          this.uploadProgress = Math.round(percentage);
        },
        error => {
          console.log(error);
        }

      );
    }
    else {
      let n = {
        image: "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1",
        title: f.elements["title"].value,
        text: f.elements["description"].value,
        author: u.name,
        country: f.elements["country"].value,
        date: new Date().toISOString().split("T")[0],
        id: "",
        file: "",
        uid: u.uid,
      }
      this.covidService.addNews(n)
    }
  }



}