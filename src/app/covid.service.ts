import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { Info } from './info.model';
import { User } from './user.model';
import { from, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { News } from './news.model';
import { finalize } from 'rxjs/operators';

//TODO: user restrictions
//TODO: signout
//TODO: valueChanges instead of get


//TODO: handle routes permissions

export interface FilesUploadMetadata {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}


@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private user: User
  public ncomm = 0;
  public countries = []
  public current = "WorldWide"

  public dataSummaryReady = false
  public dataReady = false
  public newsReady = false



  public byCountry: Info[]
  public summary: Info = new Info("test", 0, 0, 0, 0, 0, 0)
  public totalConf = []
  public totalDeath = []
  public totalRec = []
  public dayslabels = []
  public newDeath = []
  public newConf = []
  public newRec = []



  public newsDetail: News = {
    image: "",
    title: "",
    text: "",
    author: "",
    uid: "",
    file: "",
    country: "",
    date: "",
    id: "",
  }

  public allNews: Array<News>



  private covid_API = 'https://api.covid19api.com/';  // URL to web api

  constructor(private http: HttpClient, private afAuth: AngularFireAuth,
    private router: Router, private firestore: AngularFirestore, private afStorage: AngularFireStorage) { }


  setAllInfoHomePage() {
    this.dataReady = false
    this.dataSummaryReady = false
    this.dayslabels = []
    this.newConf = []
    this.newDeath = []
    this.newRec = []
    this.totalConf = []
    this.totalDeath = []
    this.totalRec = []
    console.log("taking data")
    this.getSummary().subscribe(data => {
      this.summary = new Info("Global", data["Global"]["TotalConfirmed"], data["Global"]["NewConfirmed"], data["Global"]["TotalRecovered"], data["Global"]["NewRecovered"], data["Global"]["TotalDeaths"], data["Global"]["NewDeaths"])
      console.log(this.summary)
      this.byCountry = new Array<Info>();
      this.countries = []
      for (let i = 0; i < data["Countries"].length; i++) {
        let elem = data["Countries"][i]
        this.countries.push(data["Countries"][i]["Country"])
        this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
      }
      this.dataSummaryReady = true
      this.getFromApril().subscribe(d => {


        let sortable = []
        for (let elem in d) {
          sortable.push(d[elem])
        }
        let i = sortable.length
        for (let elem in sortable) {
          this.totalConf[elem] = sortable[elem]["TotalConfirmed"]
          this.totalRec[elem] = sortable[elem]["TotalRecovered"]
          this.totalDeath[elem] = sortable[elem]["TotalDeaths"]
          this.dayslabels[elem] = formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)), 'dd MMM', 'en')
          i = i - 1
        }
        this.totalConf.sort(function (a, b) {
          var x = a; var y = b;
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
        this.totalDeath.sort(function (a, b) {
          var x = a; var y = b;
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
        this.totalRec.sort(function (a, b) {
          var x = a; var y = b;
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
        for (let j = sortable.length - 7; j < sortable.length; j++) {
          this.newConf[j + 7 - sortable.length] = this.totalConf[j] - this.totalConf[j - 1]
          this.newRec[j + 7 - sortable.length] = this.totalRec[j] - this.totalRec[j - 1]
          this.newDeath[j + 7 - sortable.length] = this.totalDeath[j] - this.totalDeath[j - 1]
        }
        this.dayslabels[this.totalRec.length] = formatDate(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000)), 'dd MMM', 'en')
        this.newConf[this.newConf.length] = this.summary["newCases"]
        this.newDeath[this.newDeath.length] = this.summary["newDeath"]
        this.newRec[this.newRec.length] = this.summary["newRecovery"]
        this.totalConf[this.totalConf.length] = this.summary["totalCases"]
        this.totalDeath[this.totalDeath.length] = this.summary["totalDeath"]
        this.totalRec[this.totalRec.length] = this.summary["totalRecovery"]
        this.dataReady = true
      })
    })
  }


  setAllInfoCountry(c: string) {
    this.getCountries()
    this.current = c
    this.dataReady = false
    this.dataSummaryReady = false
    this.dayslabels = []
    this.newConf = []
    this.newDeath = []
    this.newRec = []
    this.totalConf = []
    this.totalDeath = []
    this.totalRec = []

    this.getCountryInfoAPI(c)

  }

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
    })
  }

  getFromApril() {
    let now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let from = "2020-04-13"
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "world?from=" + from + "&to=" + now, options)
  }

  getAllFromCountry(country_name: string) {
    let options: { responseType?: "json" }
    this.http.get(this.covid_API + "dayone/country/" + country_name, options).subscribe(d => {
      console.log(d)
      let sortable = []
      for (let elem in d) {
        //Avoid problems with States like France
        if (d[elem]["Province"] == "")
          sortable.push(d[elem])
      }
      let i = sortable.length
      for (let elem in sortable) {
        this.totalConf[elem] = sortable[elem]["Confirmed"]
        this.totalRec[elem] = sortable[elem]["Recovered"]
        this.totalDeath[elem] = sortable[elem]["Deaths"]
        this.dayslabels[elem] = formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)), 'dd MMM', 'en')
        i = i - 1
      }
      this.totalConf.sort(function (a, b) {
        var x = a; var y = b;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      this.totalDeath.sort(function (a, b) {
        var x = a; var y = b;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      this.totalRec.sort(function (a, b) {
        var x = a; var y = b;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      for (let j = sortable.length - 7; j < sortable.length; j++) {
        this.newConf[j + 7 - sortable.length] = this.totalConf[j] - this.totalConf[j - 1]
        this.newRec[j + 7 - sortable.length] = this.totalRec[j] - this.totalRec[j - 1]
        this.newDeath[j + 7 - sortable.length] = this.totalDeath[j] - this.totalDeath[j - 1]
      }
      this.dayslabels[this.totalRec.length] = formatDate(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000)), 'dd MMM', 'en')
      this.newConf[this.newConf.length] = this.summary["newCases"]
      this.newDeath[this.newDeath.length] = this.summary["newDeath"]
      this.newRec[this.newRec.length] = this.summary["newRecovery"]
      this.totalConf[this.totalConf.length] = this.summary["totalCases"]
      this.totalDeath[this.totalDeath.length] = this.summary["totalDeath"]
      this.totalRec[this.totalRec.length] = this.summary["totalRecovery"]
      this.dataReady = true
    })
  }

  getCountryInfoAPI(country_name: string) {
    let index = this.countries.indexOf(country_name)
    this.firestore.collection("Countries").doc(country_name).get().subscribe((doc) => {
      let last: Date;
      let now = new Date();
      if (doc.exists) {
        last = doc.data()["lastUpdate"].toDate();

        if (last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate()) {
          console.log("no update")
          this.summary = new Info(doc.data()["name"], doc.data()["totalCases"], doc.data()["newCases"], doc.data()["totalRecovery"], doc.data()["newRecovery"], doc.data()["totalDeath"], doc.data()["newDeath"])
          console.log(this.summary)
          this.dataSummaryReady = true
          this.getAllFromCountry(country_name)
          return
        }
      }
      console.log("update")

      this.getSummary().subscribe(data => {
        let elem = data["Countries"][index]
        let c = new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"])
        this.summary = c
        this.dataSummaryReady = true
        this.firestore.collection("Countries").doc(c.name).set({
          name: c.name,
          totalCases: c.totalCases,
          newCases: c.newCases,
          totalRecovery: c.totalRecovery,
          newRecovery: c.newRecovery,
          totalDeath: c.totalDeath,
          newDeath: c.newDeath,
          activeCases: c.activeCases,
          recoveryRate: c.recoveryRate,
          mortalityRate: c.mortalityRate,
          lastUpdate: new Date()
        }, { merge: true })
        this.getAllFromCountry(country_name)
      }
      )
    })
  }

  public async signInWithGoogle() {
    const cred = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    console.log(cred.user)
    this.user = {
      uid: cred.user.uid,
      name: cred.user.displayName,
      email: cred.user.email,
      img: cred.user.photoURL
    }
    this.setUser(this.user);
    localStorage.setItem("user", JSON.stringify(this.user))
  }

  setUser(user) {
    this.firestore.collection("Users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      status: "None",
      img: user.img
    })
  }

  public getUser(): User {
    if (this.user == null && JSON.parse(localStorage.getItem("User")) !== null) {
      this.user = JSON.parse(localStorage.getItem("User"))
    }
    if (this.user != undefined) {
      let result = this.user
      return result
    }
    else {
      let result = {
        uid: "",
        name: "",
        email: "",
        img: ""
      }
      return result
    }
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

  addNewsWithFile(n: News, f: File): Observable<number> {
    let randomId = Math.random().toString(36).slice(2)
    const filePath = `/${randomId + f.name}`
    const storageRef = this.afStorage.ref(filePath);
    const uploadTask = this.afStorage.upload(filePath, f);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          n.image = downloadURL;
          n.file = randomId + f.name
          this.addNews(n);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }



  public addNews(n: News) {
    this.ncomm++
    n.id = this.ncomm.toString()
    this.firestore.collection("AllNews").doc(n.id).set(
      n, { merge: true }
    )

    if (n.country != "WorldWide") {
      this.firestore.collection("Countries").doc(n.country).collection("News").doc(n.id).set(
        n, { merge: true }
      )

    }
    this.allNews.push(n)
    //let modal = document.getElementById("exampleModalCenter")
  }

  public removeFile(n: News) {
    let f = n.file
    n.image = "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1";

    this.afStorage.ref("").child(f).delete();
    this.firestore.collection("AllNews").doc(n.id).set(
      n, { merge: true }
    ).then(() => {
      if (n.country != "WorldWide") {
        this.firestore.collection("Countries").doc(n.country).collection("News").doc(n.id).set(
          n, { merge: true }
        )

      }
    }).then(() => {
      let index = this.allNews.indexOf(n)
      this.allNews[index].image = "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1";
    }
    )


  }

  public goToCountry(cname) {
    if (cname != "WorldWide") {
      this.current = cname
      this.setAllInfoCountry(cname)
      this.router.navigate(['./country/' + cname])
    }
    else {
      this.current = cname
      this.router.navigate(['./summary/'])
    }

  }



  public filterNews(country) {
    this.newsReady = false
    this.current = country
    this.allNews = []
    if (country != "WorldWide") {
      this.firestore.collection("Countries").doc(country).collection("News").get().subscribe((snapshot) => {
        snapshot.forEach(doc => {
          if (doc.exists) {
            this.ncomm++;
            this.allNews.push({
              image: doc.data()["image"],
              title: doc.data()["title"],
              text: doc.data()["text"],
              author: doc.data()["author"],
              uid: doc.data()["uid"],
              file: doc.data()["file"],
              country: doc.data()["country"],
              date: doc.data()["date"],
              id: doc.data()["id"],
            })
            this.allNews.reverse()
            this.newsReady = true
            console.log(this.allNews)

          }
        })
      })
    }
    else {
      this.getNews().subscribe((snapshot) => {
        snapshot.forEach(doc => {
          if (doc.exists) {
            this.ncomm++;
            this.allNews.push({
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
            this.allNews.reverse()
            this.newsReady = true
            console.log(this.allNews)


          }
        })
      })
    }
  }



  public removeNews(n) {
    this.firestore.collection("AllNews").doc(n.id).delete()

    let index = this.allNews.indexOf(n)
    this.allNews.splice(index, 1)

    if (n.country != "WorldWide") {
      this.firestore.collection("Countries").doc(n.country).collection("News").doc(n.id).delete()
    }


  }

  public goToNews(n) {
    this.newsDetail = n
    console.log(this.newsDetail)
    this.router.navigate(['./news/' + n.id])
  }


  public setCurrentNews(id) {
    this.firestore.collection("AllNews").doc(id).get().subscribe((doc) => {
      if (doc.exists) {
        console.log(doc)
        this.newsDetail.id = doc.data()["id"];
        this.newsDetail.author = doc.data()["author"];
        this.newsDetail.country = doc.data()["country"];
        this.newsDetail.date = doc.data()["date"];
        this.newsDetail.file = doc.data()["file"];
        this.newsDetail.image = doc.data()["image"];
        this.newsDetail.text = doc.data()["text"];
        this.newsDetail.title = doc.data()["title"];
        this.newsDetail.uid = doc.data()["uid"];

        console.log(this.newsDetail)
      }
      else {
        this.router.navigate(['./news'])
      }
    })

  }

}
