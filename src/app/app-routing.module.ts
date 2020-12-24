import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryComponent } from './country/country.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NewsComponent } from './news/news.component';

const routes: Routes = [
  { path: "home", component: HomepageComponent },
  { path: "news", component: NewsComponent },
  { path: "country/:name", component: CountryComponent },
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
