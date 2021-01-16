import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../news.model';
import * as $ from "jquery";
import { AngularFireStorage } from '@angular/fire/storage';


//TODO: proper modal hide
//TODO: add news as ngModel + ngSubmit + reset to undefined
//TODO: handle news edit -> video
//TODO: news indexing + id -> almost
//TODO: filter by country, done, but show properly 
//TODO: think to other way for news ids -> timestamp + uid
//TODO: properly fix CSS modal
//TODO: show upload file progress
//TODO: update news when inserting one with image 
//TODO: page to show news selected -> evaluate add comments


//TODO: news array in covid servece, evaluate logic move

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
    this.news = []
    this.covidService.getNews().subscribe((snapshot) => {
      snapshot.forEach(doc => {
        if (doc.exists) {
          this.covidService.ncomm++;
          this.news.push({
            image: doc.data()["image"],
            title: doc.data()["title"],
            text: doc.data()["text"],
            author: doc.data()["author"],
            country: doc.data()["country"],
            file: doc.data()["file"],
            date: doc.data()["date"],
            id: doc.data()["id"],
            uid: doc.data()["uid"]
          })
        }
      })
      this.news.reverse()
      //console.log(this.covidService.ncomm)
    })


  }
  /*
  public filterByCountry(country) {
    this.news = []
    this.covidService.filterNews(country).subscribe(((snapshot) => {
      snapshot.forEach(doc => {
        if (doc.exists) {
          this.covidService.ncomm++;
          this.news.push({
            image: doc.data()["image"],
            title: doc.data()["title"],
            text: doc.data()["text"],
            author: doc.data()["author"],
            country: doc.data()["country"],
            date: doc.data()["date"],
            id: doc.data()["id"]
          })
        }
      })
      console.log(this.news)
    }))
    */


  findFile(event) {
    this.f = event.target.files.item(0)
  }

  deleteImage(n) {
    this.covidService.removeFile(n);
    n.image = "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1";

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
      this.news.push(n)
    }
  }


  /*public addNews() {
    let f = document.forms["news"]
    let u = this.covidService.getUser()


    console.log(this.downloadURL)
    //save image and get link
    if (this.f !== undefined) {
      let n = {
        image: "",
        title: f.elements["title"].value,
        text: f.elements["description"].value,
        author: u.name,
        country: f.elements["country"].value,
        date: new Date().toISOString().split("T")[0],
        id: "",
        uid: u.uid,
      }
      this.covidService.addNewsWithFile(n,)
    }
    else {
      let n = {
        image: "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1",
        title: f.elements["title"].value,
        file: null,
        text: f.elements["description"].value,
        author: u.name,
        country: f.elements["country"].value,
        date: new Date().toISOString().split("T")[0],
        id: "",
        uid: u.uid,
      }
      this.covidService.addNews(n)
      this.news.push(n)
    }

  }

  public removeNews(n) {
    this.covidService.removeNews(n)
    this.news = this.news.filter(a => a != n)
  }
*/
}