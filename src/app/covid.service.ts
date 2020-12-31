import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { Info } from './info.model';
import { User } from './user.model';

//TODO: user restrictions
//TODO: user session storage
//TODO: signout
//TODO: valueChanges instead of get

//TODO: handle routes permissions

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private user: User
  public ncomm = 0;
  public countries = []
  private cnews = "WorldWide"

  private covid_API = 'https://api.covid19api.com/';  // URL to web api
  constructor(private http: HttpClient, private afAuth: AngularFireAuth,
    private router: Router, private firestore: AngularFirestore) { }

  getSummary() {
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "summary", options)
  }

  getCountries() {
    if (this.countries.length > 0)
      return;
    this.http.get(this.covid_API + "summary").subscribe((res) => {
      for (let el in res["Countries"]) {

        this.countries.push(res["Countries"][el]["Country"])
      }
      console.log(this.countries)
    })
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

  public async updateCountryInfo(country: Info) {
    await this.firestore.collection("Countries").doc(country.name).set({
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
    console.log("asfai")
  }

  getAllFromCountry(country_name: string) {
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "dayone/country/" + country_name, options)
  }

  getLastSevenFromCountry(country_name: string) {
    let now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let from = formatDate(new Date(new Date().getTime() - (8 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd', 'en');
    let options: { responseType?: "json" }
    console.log(this.covid_API + "country/" + country_name + "?from=" + from + "&to=" + now, options)
    return this.http.get(this.covid_API + "country/" + country_name + "?from=" + from + "&to=" + now, options)

  }

  async getCountryInfoAPI(country_name: string) {
    let index = this.countries.indexOf(country_name)
    console.log(country_name)
    console.log(this.countries)

    await this.getSummary().toPromise().then(async data => {
      let elem = data["Countries"][index]
      console.log(elem)
      await this.updateCountryInfo(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
    })
    console.log("fafss")
  }


  public async getCountryInfoDB(country_name: string) {
    this.firestore.collection("Countries").doc(country_name).get().subscribe(async (doc) => {
      let last: Date;

      let now = new Date();
      if (doc.exists) {
        last = doc.data()["lastUpdate"].toDate();
        console.log(last);

        if (last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate()) {
          return;
        }
      }
      console.log("not exist");
      await this.getCountryInfoAPI(country_name);
      console.log("added1");
    })
    console.log("done")
    return this.firestore.collection("Countries").doc(country_name).get()
  }

  public async signInWithGoogle() {
    const cred = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    this.user = {
      uid: cred.user.uid,
      name: cred.user.displayName,
      email: cred.user.email
    }
    this.setUser(this.user);
    localStorage.setItem("user", JSON.stringify(this.user))
  }

  setUser(user) {
    this.firestore.collection("Users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      status: "None"
    })
  }

  public getUser(): User {
    if (this.user == null && JSON.parse(localStorage.getItem("User")) !== null) {
      this.user = JSON.parse(localStorage.getItem("User"))
    }
    return this.user
  }

  public signOut() {
    this.user = null;
    localStorage.removeItem("User")
    this.router.navigate(["/home"])
  }

  public news() {
    this.router.navigate(['./news'])
  }

  public getNews() {
    return this.firestore.collection("AllNews",).get()
  }

  public addNews(n) {

    this.ncomm++

    this.firestore.collection("AllNews").doc(this.ncomm.toString()).set(
      n, { merge: true }
    )

    if (n.country != "WorldWide") {
      this.firestore.collection("Countries").doc(n.country).collection("News").doc(this.ncomm.toString()).set(
        n, { merge: true }
      )

    }
    //let modal = document.getElementById("exampleModalCenter")
  }

  public goToCountry(cname) {
    if (cname != "WorldWide") {
      this.router.navigate(['./country/' + cname])
    }
    else {
      this.router.navigate(['./summary/'])
    }

  }

  public filterNews(country) {
    this.cnews = country
    if (country != "WorldWide") {
      return this.firestore.collection("Countries").doc(country).collection("News").get()
    }
    else
      return this.getNews()
  }

}
