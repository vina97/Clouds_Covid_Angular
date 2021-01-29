import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import firebase from "firebase/app";
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { Info } from './info.model';
import { User } from './user.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { News } from './news.model';
import { finalize, retry } from 'rxjs/operators';
import { Comment } from './comment.model'



export interface FilesUploadMetadata {
  uploadProgress$: Observable<number>;
  downloadUrl$: Observable<string>;
}


@Injectable({
  providedIn: 'root'
})
export class CovidService {

  public signup_error = false
  public login_error = false
  private user: User
  public ncomm = 0;
  public countries = []
  public current = "WorldWide"

  public dataSummaryReady = false
  public dataReady = false
  public newsReady = false
  public loading = false



  public byCountry: Info[]
  public summary: Info = new Info("test", 0, 0, 0, 0, 0, 0)
  public totalConf = []
  public totalDeath = []
  public totalRec = []
  public dayslabels = []
  public newDeath = []
  public newConf = []
  public newRec = []

  public comments: Comment[]
  public loadComments = false



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

  //API calls + info set for worldwide homepage
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
    this.getSummary().subscribe(data => {
      //get info for summary
      this.summary = new Info("Global", data["Global"]["TotalConfirmed"], data["Global"]["NewConfirmed"], data["Global"]["TotalRecovered"], data["Global"]["NewRecovered"], data["Global"]["TotalDeaths"], data["Global"]["NewDeaths"])
      this.byCountry = new Array<Info>();
      this.countries = []
      //get info for country table
      for (let i = 0; i < data["Countries"].length; i++) {
        let elem = data["Countries"][i]
        this.countries.push(data["Countries"][i]["Country"])
        this.byCountry.push(new Info(elem["Country"], elem["TotalConfirmed"], elem["NewConfirmed"], elem["TotalRecovered"], elem["NewRecovered"], elem["TotalDeaths"], elem["NewDeaths"]))
      }
      this.dataSummaryReady = true
      this.getFromApril_API2().subscribe(d => {
        //set last days data
        for (let i = 0; i < Object.keys(d["cases"]).length; i++) {
          this.totalConf[i] = Object.values(d["cases"])[i]
          this.totalRec[i] = Object.values(d["recovered"])[i]
          this.totalDeath[i] = Object.values(d["deaths"])[i]
          this.dayslabels[i] = Object.keys(d["cases"])[i]

        }
        //compute last 7 info with math
        for (let j = this.totalConf.length - 7; j < this.totalConf.length; j++) {
          this.newConf[j + 7 - this.totalConf.length] = this.totalConf[j] - this.totalConf[j - 1]
          this.newRec[j + 7 - this.totalConf.length] = this.totalRec[j] - this.totalRec[j - 1]
          this.newDeath[j + 7 - this.totalConf.length] = this.totalDeath[j] - this.totalDeath[j - 1]
        }
        //set today data
        this.newConf[this.newConf.length] = this.summary["newCases"]
        this.newDeath[this.newDeath.length] = this.summary["newDeath"]
        this.newRec[this.newRec.length] = this.summary["newRecovery"]
        this.dataReady = true
      })
      /*
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
      */
    })

  }

  //reset values + populate the country page
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

  //Set all country possibilities for menu choice
  getCountries() {
    if (this.countries.length > 0)
      return;
    this.http.get(this.covid_API + "summary").subscribe((res) => {
      for (let el in res["Countries"]) {

        this.countries.push(res["Countries"][el]["Country"])
      }
    })
  }
  /*
  getFromApril() {
    let now = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let from = "2020-04-13"
    let options: { responseType?: "json" }
    return this.http.get(this.covid_API + "world?from=" + from + "&to=" + now, options)
  }
  */

  getFromApril_API2() {
    return this.http.get("https://corona.lmao.ninja/v2/historical/all")
  }

  //use api to set all info for country page
  getAllFromCountry(country_name: string) {
    let options: { responseType?: "json" }
    this.http.get(this.covid_API + "dayone/country/" + country_name, options).subscribe(d => {
      let sortable = []
      for (let elem in d) {
        //Avoid problems with States like France
        if (d[elem]["Province"] == "")
          sortable.push(d[elem])
      }
      let i = sortable.length
      for (let elem in sortable) {
        // push all elements retrieved
        this.totalConf[elem] = sortable[elem]["Confirmed"]
        this.totalRec[elem] = sortable[elem]["Recovered"]
        this.totalDeath[elem] = sortable[elem]["Deaths"]
        this.dayslabels[elem] = formatDate(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)), 'dd MMM', 'en')
        i = i - 1
      }
      //sort arrays
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
      //set last 7 days using math
      for (let j = sortable.length - 7; j < sortable.length; j++) {
        this.newConf[j + 7 - sortable.length] = this.totalConf[j] - this.totalConf[j - 1]
        this.newRec[j + 7 - sortable.length] = this.totalRec[j] - this.totalRec[j - 1]
        this.newDeath[j + 7 - sortable.length] = this.totalDeath[j] - this.totalDeath[j - 1]
      }
      //set final day (today)
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

  //check summary info up-to-date, else do API call and update
  getCountryInfoAPI(country_name: string) {
    let index = this.countries.indexOf(country_name)
    this.dayslabels = []
    this.newConf = []
    this.newDeath = []
    this.newRec = []
    this.totalConf = []
    this.totalDeath = []
    this.totalRec = []
    this.firestore.collection("Countries").doc(country_name).get().subscribe((doc) => {
      let last: Date;
      let now = new Date();
      if (doc.exists) {
        // have something in db 
        last = doc.data()["lastUpdate"].toDate();

        if (last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate()) {
          // db is up to date
          this.summary = new Info(doc.data()["name"], doc.data()["totalCases"], doc.data()["newCases"], doc.data()["totalRecovery"], doc.data()["newRecovery"], doc.data()["totalDeath"], doc.data()["newDeath"])
          this.dataSummaryReady = true
          this.getAllFromCountry(country_name)
          return
        }
      }
      //db is not up to date (or country is not in db)
      this.getSummary().subscribe(data => {
        //get info from API
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

  //signup without google
  public signup(name, psw) {
    this.signup_error = false
    this.login_error = false
    //check if username already exists
    this.firestore.collection("Users").doc(name).get().subscribe(res => {
      if (res.exists) {
        this.signup_error = true
        return
      }
      else {
        this.firestore.collection("Users").doc(name).set({
          name: name,
          password: psw,
          status: "none"
        }).then(() => this.loginWithPsw(name, psw))
      }
    })
  }

  //login without google
  public loginWithPsw(name, psw) {
    this.login_error = false
    this.signup_error = false
    this.firestore.collection("Users").doc(name).get().subscribe(usr => {
      if (usr.exists && usr.data()["password"] == psw) {
        this.user = {
          uid: name,
          name: name,
          email: "",
          status: "none"
        }
        this.closeModal('id01')
      }
      else {
        this.login_error = true
      }
    })
  }

  //google login
  public async signInWithGoogle() {
    const cred = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    this.user = {
      uid: cred.user.uid,
      name: cred.user.displayName,
      email: cred.user.email,
      status: "editor"
    }
    this.setUser(this.user);
    localStorage.setItem("user", JSON.stringify(this.user))
    this.closeModal('id01')
  }

  setUser(user) {
    //set user to db
    this.firestore.collection("Users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      status: user.status,
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
        status: ""
      }
      return result
    }
  }


  public signOut() {
    this.user = null;
    localStorage.removeItem("User")
    this.router.navigate(["/home"])
    window.scrollTo(0, 0)
  }

  //routing function
  public news() {
    this.router.navigate(['./news'])
    window.scrollTo(0, 0)
  }

  public getNews() {
    return this.firestore.collection("AllNews").get()
  }

  //upload custom file + news
  addNewsWithFile(n: News, f: File) {
    this.loading = true
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
    ).subscribe(() => {
    });

  }


  //upload news 
  public addNews(n: News) {
    this.loading = true
    n.id = Math.random().toString(36).slice(2) + n.uid
    this.firestore.collection("AllNews").doc(n.id).set(
      n, { merge: true }
    )
    //add to country too
    if (n.country != "WorldWide") {
      this.firestore.collection("Countries").doc(n.country).collection("News").doc(n.id).set(
        n, { merge: true }
      )

    }
    this.allNews.unshift(n)
    this.loading = false
    this.closeModal("ModalNews")
  }

  //remove uploaded file and set placeholder
  public removeFile(n: News) {
    let f = n.file
    n.image = "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1";
    n.file = ""

    this.afStorage.ref("").child(f).delete();
    this.firestore.collection("AllNews").doc(n.id).set(
      n, { merge: true }
    ).then(() => {
      //set placeholder image to database
      if (n.country != "WorldWide") {
        this.firestore.collection("Countries").doc(n.country).collection("News").doc(n.id).set(
          n, { merge: true }
        )

      }
    }).then(() => {
      //update what is shown
      let index = this.allNews.indexOf(n)
      this.allNews[index].image = "https://firebasestorage.googleapis.com/v0/b/covid-project-eurecom.appspot.com/o/covid19_icon.png?alt=media&token=758be0c7-a52f-486e-aec2-05882964bbc1";
      this.allNews[index].file = ""
    }
    )


  }

  //routing function
  public goToCountry(cname) {
    if (cname != "WorldWide") {
      this.current = cname
      this.setAllInfoCountry(cname)
      this.router.navigate(['./country/' + cname])
      window.scrollTo(0, 0)
    }
    else {
      this.current = cname
      this.router.navigate(['./summary/'])
      window.scrollTo(0, 0)
    }

  }


  //perform a filter on the news by country 
  public filterNews(country) {
    this.newsReady = false
    this.current = country
    this.allNews = []
    if (country != "WorldWide") {
      //filter news by country -> access the inner collection of the selected country
      this.firestore.collection("Countries").doc(country).collection("News", ref => ref.orderBy('date', 'asc')).get().subscribe((snapshot) => {
        snapshot.forEach(doc => {
          if (doc.exists) {
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
            this.allNews = this.sortbydateDecr(this.allNews)
          }
        })
        this.newsReady = true
      })
    }
    else {
      //get all news
      this.getNews().subscribe((snapshot) => {
        snapshot.forEach(doc => {
          if (doc.exists) {
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
            this.allNews = this.sortbydateDecr(this.allNews)
          }
        })
        this.newsReady = true
      })
    }
  }


  public removeNews(n) {
    //remove comments from news
    this.firestore.collection("AllNews").doc(n.id).collection("Comments").get().subscribe((snapshot) => {
      snapshot.forEach(doc => {
        if (doc.exists) {
          let id = doc.data()["id"]
          this.firestore.collection("AllNews").doc(n.id).collection("Comments").doc(id).delete()
        }
      })
    })
    //remove news from allnews collection
    this.firestore.collection("AllNews").doc(n.id).delete()

    //remove news from shown
    let index = this.allNews.indexOf(n)
    this.allNews.splice(index, 1)

    //remove news from country collection
    if (n.country != "WorldWide") {
      this.firestore.collection("Countries").doc(n.country).collection("News").doc(n.id).delete()
    }


  }

  //routing function
  public goToNews(n) {
    this.newsDetail = n
    this.router.navigate(['./news/' + n.id])
    window.scrollTo(0, 0)
    this.setCurrentNews(n.id)
  }

  // load clicked news info to show
  public setCurrentNews(id) {
    this.comments = []
    if (this.allNews == undefined) {
      this.filterNews(this.current)
    }
    this.firestore.collection("AllNews").doc(id).get().subscribe((doc) => {
      if (doc.exists) {
        //get details
        this.newsDetail.id = doc.data()["id"];
        this.newsDetail.author = doc.data()["author"];
        this.newsDetail.country = doc.data()["country"];
        this.newsDetail.date = doc.data()["date"];
        this.newsDetail.file = doc.data()["file"];
        this.newsDetail.image = doc.data()["image"];
        this.newsDetail.text = doc.data()["text"];
        this.newsDetail.title = doc.data()["title"];
        this.newsDetail.uid = doc.data()["uid"];
        this.loadComments = true
        this.firestore.collection("AllNews").doc(id).collection("Comments").get().subscribe((snapshot) => {
          //reset comments and get them all
          this.comments = []
          snapshot.forEach(doc => {
            if (doc.exists) {
              let c = {
                user: doc.data()["user"],
                date: doc.data()["date"],
                text: doc.data()["text"],
                id: doc.data()["id"],
                uid: doc.data()["uid"]
              }
              this.comments.unshift(c)
              this.comments = this.sortbydateDecr(this.comments)
            }
          })
        })
        this.loadComments = false

      }
      else {
        this.router.navigate(['./news'])
        window.scrollTo(0, 0)
      }
    })

  }

  //function to move between news using arrows from the proper news page
  public loadNews(i) {
    let index = this.allNews.indexOf(this.newsDetail)
    let newindex = index + i
    if (newindex < 0)
      this.goToNews(this.allNews[this.allNews.length - 1])
    else if (newindex == this.allNews.length)
      this.goToNews(this.allNews[0])
    else
      this.goToNews(this.allNews[newindex])
  }

  //collect and upload comment to current news
  public addComment() {
    let text = (<HTMLInputElement>document.getElementById("comment")).value
    if (text != "") {
      //set comment
      let c = {
        user: this.user.name,
        date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        text: text,
        id: Date.now().toString() + this.user.uid,
        uid: this.user.uid
      }
      //upload to db
      this.firestore.collection("AllNews").doc(this.newsDetail.id).collection("Comments").doc(c.id).set(
        c, { merge: true }
      ).then(() => {
        this.comments.unshift(c)
      })
    }
  }

  public removeComment(c) {
    this.firestore.collection("AllNews").doc(this.newsDetail.id).collection("Comments").doc(c.id).delete()
    let index = this.comments.indexOf(c)
    this.comments.splice(index, 1)
  }

  //search modal and diplsay it
  public displayModal(id) {
    document.getElementById(id).style.display = 'block'
    window.onclick = function (event) {
      if (event.target == document.getElementById(id)) {
        if (id == "ModalNews") {
          (<HTMLFormElement>document.getElementById("news")).reset()
        }
        document.getElementById(id).style.display = 'none'
      }
    }
  }

  //close modal
  public closeModal(id) {
    if (id == "ModalNews") {
      //reset form
      if (document.getElementById("news") != undefined)
        (<HTMLFormElement>document.getElementById("news")).reset()
    }
    document.getElementById(id).style.display = 'none'
  }

  //quick function to sort items
  sortbydateDecr(v) {
    return v.sort(function (a, b) {
      return - (new Date(a.date).getTime() - new Date(b.date).getTime())
    })
  }

}
