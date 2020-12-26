import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../news.model';

//TODO: logged check + show proper button (login vs add news)
//TODO: handle file upload
//TODO: proper modal hide
//TODO: handle news removal/edit
//TODO: news indexing + id
//TODO: filter by country
//TODO: news from country
//TODO: news insertion update
//TODO: cards in multiple pages + Small Card preview and big card on click (may be modal as well)
//TODO: sort news in descending order (from newest to oldest)

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
          })
        }
      })
      //console.log(this.covidService.ncomm)
    })
  }

}
