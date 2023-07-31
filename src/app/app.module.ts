import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Chapter1Component } from './chapter1/chapter1.component';
import { Chapter2Component } from './chapter2/chapter2.component';
import { Chapter3Component } from './chapter3/chapter3.component';
import { Chapter4Component } from './chapter4/chapter4.component';
import { StmGraphComponent } from './stm-graph/stm-graph.component';
import { AntiDdosInfoComponent } from './stm-graph/anti-ddos-info/anti-ddos-info.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    Chapter1Component,
    Chapter2Component,
    Chapter3Component,
    Chapter4Component,
    StmGraphComponent,
    AntiDdosInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
