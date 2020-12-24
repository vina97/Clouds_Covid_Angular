import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../news.model';

//TODO: logged check + show proper button (login vs add news)


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news: Array<News>

  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
    this.news = []
    this.covidService.getNews().subscribe((snapshot) => {
      snapshot.forEach(doc => {
        if (doc.exists) {
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
    })
  }

}
