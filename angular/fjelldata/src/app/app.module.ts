import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RacesComponent } from './races/races.component';
import { RaceDetailComponent } from './race-detail/race-detail.component';
import { DataService } from './data.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppGlobals } from './app.global';
import { AppRoutingModule } from './app-routing.module';
import { ChartComponent } from './chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { RaceComponent } from './race/race.component';
import { CapitalizefirstPipe } from './capitalizefirst.pipe';
import { RunnerDetailComponent } from './runner-detail/runner-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    RacesComponent,
    RaceDetailComponent,
    MessagesComponent,
    ChartComponent,
    RaceComponent,
    CapitalizefirstPipe,
    RunnerDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule
  ],

  providers: [DataService, MessageService, AppGlobals],
  bootstrap: [AppComponent]
})
export class AppModule { }
