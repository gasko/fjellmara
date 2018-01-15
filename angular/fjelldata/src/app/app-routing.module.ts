import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RacesComponent }      from './races/races.component';
import { RaceComponent }  from './race/race.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  { path: 'races', component: RacesComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'race/:alias', component: RaceComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
