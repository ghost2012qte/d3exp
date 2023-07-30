import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Chapter1Component } from './chapter1/chapter1.component';
import { Chapter2Component } from './chapter2/chapter2.component';
import { Chapter3Component } from './chapter3/chapter3.component';
import { Chapter4Component } from './chapter4/chapter4.component';
import { ExperimentalComponent } from './experimental/experimental.component';
import { StmGraphComponent } from './stm-graph/stm-graph.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/chapter1' },
  { path: 'chapter1', component: Chapter1Component },
  { path: 'chapter2', component: Chapter2Component },
  { path: 'chapter3', component: Chapter3Component },
  { path: 'chapter4', component: Chapter4Component },
  { path: 'experimental', component: ExperimentalComponent },
  { path: 'stm-graph', component: StmGraphComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
