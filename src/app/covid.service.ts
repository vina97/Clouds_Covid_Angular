import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { Info } from './info.model';



@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private covid_API = 'https://api.covid19api.com/';  // URL to web api
  constructor(private http: HttpClient, private afAuth: AngularFireAuth,
    private router: Router, private firestore: AngularFirestore) { }

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

  getFromApril() {
    let now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let from = "2020-04-13"
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "world?from=" + from + "&to=" + now, options)
  }

  public updateCountryInfo(country: Info) {
    this.firestore.collection("Countries").doc(country.name).set({
      name: country.name,
      totalCases: country.totalCases,
      newCases: country.newCases,
      totalRecovery: country.totalRecovery,
      newRecovery: country.newRecovery,
      totalDeath: country.totalDeath,
      newDeath: country.newDeath,
      activeCases: country.activeCases,
      recoveryRate: country.recoveryRate,
      mortalityRate: country.mortalityRate,
      lastUpdate: new Date()
    }, { merge: true })
  }

  getAllFromCountry(country_name: string) {
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "dayone/country/" + country_name, options)
  }

  getLastSevenFromCountry(country_name: string) {
    let now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let from = formatDate(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd', 'en');
    let options: { responseType?: "json" }
    console.log(this.covid_API + "country/" + country_name + "?from=" + from + "&to=" + now, options)
    return this.http.get(this.covid_API + "country/" + country_name + "?from=" + from + "&to=" + now, options)

  }

  getCountryInfoAPI(country_name: string) {
    this.getSummary().toPromise().then(data => {
      let elem = data["Countries"][0]
      this.updateCountryInfo(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
    })
  }


  public getCountryInfoDB(country_name: string) {

    this.firestore.collection("Countries").doc(country_name).get().subscribe((doc) => {
      let last: Date

      let now = new Date()
      if (doc.exists) {
        last = doc.data()["lastUpdate"].toDate()
        console.log(last)

        if (last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate()) {
          console.log("TRUE")
          return doc.data()
        }
      }

      this.getCountryInfoAPI(country_name)
    })
    return this.firestore.collection("Countries").doc(country_name).get()
  }
}
