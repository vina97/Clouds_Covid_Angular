import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private covid_API = 'https://api.covid19api.com/';  // URL to web api
  constructor(private http: HttpClient,) { }

  getSummary() {
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "summary", options)

  }

  getLastSeven() {
    let now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let from = formatDate(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd', 'en');
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "world?from=" + from + "&to=" + now, options)
  }
}
