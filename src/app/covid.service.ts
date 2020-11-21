import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Info } from './info.model';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private covid_API = 'https://api.covid19api.com/';  // URL to web api
  constructor(private http: HttpClient,) { }

  getSummary() {
    console.log(this.covid_API + "summary")
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "summary", options)

  }
}
