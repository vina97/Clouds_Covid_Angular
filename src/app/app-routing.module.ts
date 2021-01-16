import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NewsComponent } from './news/news.component';
import { NewspageComponent } from './newspage/newspage.component';

const routes: Routes = [
  { path: "home", component: HomepageComponent },
  { path: "news", component: NewsComponent },
  { path: "country/:name", component: CountryComponent },
  { path: "news/:id", component: NewspageComponent },
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
