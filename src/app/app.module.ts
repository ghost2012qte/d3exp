import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Chapter1Component } from './chapter1/chapter1.component';
import { Chapter2Component } from './chapter2/chapter2.component';
import { Chapter3Component } from './chapter3/chapter3.component';
import { Chapter4Component } from './chapter4/chapter4.component';
import { ExperimentalComponent } from './experimental/experimental.component';
import { AnimatedPieComponent } from './animated-pie/animated-pie.component';
import { StmGraphComponent } from './stm-graph/stm-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    Chapter1Component,
    Chapter2Component,
    Chapter3Component,
    Chapter4Component,
    ExperimentalComponent,
    AnimatedPieComponent,
    StmGraphComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
