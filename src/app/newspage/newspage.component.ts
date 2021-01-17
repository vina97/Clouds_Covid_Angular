import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../covid.service';

//TODO: (if time) -> comment section

@Component({
  selector: 'app-newspage',
  templateUrl: './newspage.component.html',
  styleUrls: ['./newspage.component.css']
})
export class NewspageComponent implements OnInit {

  constructor(private route: ActivatedRoute, public covidService: CovidService) { }

  ngOnInit(): void {
    if (this.covidService.newsDetail.id == "")
      this.covidService.setCurrentNews(this.route.snapshot.paramMap.get('id'))
  }

}
