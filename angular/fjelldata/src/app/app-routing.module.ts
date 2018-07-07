import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RacesComponent }      from './races/races.component';
import { RaceComponent }  from './race/race.component';
import { ChartComponent } from './chart/chart.component';
import { AppGlobals } from './app.global';
import { RunnerDetailComponent } from './runner-detail/runner-detail.component';
import { RunnerFindComponent } from './runner-find/runner-find.component';


const routes: Routes = [
  { path: 'races', component: RacesComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'race/:alias', component: RaceComponent },
  { path: 'race/:alias/:c_alias', component: RaceComponent },
  { path: 'runner/:race/:year/:bib', component: RunnerDetailComponent },
  { path: 'runner', component: RunnerFindComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
