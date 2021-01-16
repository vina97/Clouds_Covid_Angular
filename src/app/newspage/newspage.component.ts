import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';

//TODO: whole page

@Component({
  selector: 'app-newspage',
  templateUrl: './newspage.component.html',
  styleUrls: ['./newspage.component.css']
})
export class NewspageComponent implements OnInit {

  constructor(public covidService: CovidService) { }

  ngOnInit(): void {
  }

}
