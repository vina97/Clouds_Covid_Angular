import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../news.model';
import * as $ from "jquery";

//TODO: handle file upload
//TODO: proper modal hide
//TODO: add news as ngModel + ngSubmit + reset to undefined
//TODO: handle news edit -> video
//TODO: news indexing + id -> almost
//TODO: filter by country, done, but show properly 
//TODO: news from country -> explore if use country var status in covid service
//TODO: cards in multiple pages + Small Card preview and big card on click (may be modal as well) -> pagination
//TODO: page to show news selected
//TODO: think to other way for news ids

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news: Array<News>

  constructor(public covidService: CovidService) { }

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
            date: doc.data()["date"],
            id: doc.data()["id"]
          })
        }
      })
      this.news.reverse()
      this.setCarousel()
      //console.log(this.covidService.ncomm)
    })
  }

  public setCarousel() {
    $('.carousel .carousel-item').each(function () {
      var minPerSlide = 3;
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));

      for (var i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(':first');
        }

        next.children(':first-child').clone().appendTo($(this));
      }
    });
  }

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
  }

  public addNews() {
    let f = document.forms["news"]
    let u = this.covidService.getUser()
    //save image and get link
    let n = {
      image: "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1",
      title: f.elements["title"].value,
      text: f.elements["description"].value,
      author: u.name,
      country: f.elements["country"].value,
      date: new Date().toISOString().split("T")[0],
      id: ""
    }
    this.covidService.addNews(n)
    this.news.push(n)

  }

  public removeNews(n) {
    this.covidService.removeNews(n)
    this.news = this.news.filter(a => a != n)
  }

}
