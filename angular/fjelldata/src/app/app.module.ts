import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RunnersComponent } from './runners/runners.component';
import { RacesComponent } from './races/races.component';
import { RaceDetailComponent } from './race-detail/race-detail.component';
import { PassingService } from './passing.service';
import { RaceService } from './race.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './app-routing.module';
import { ChartComponent } from './chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import { RaceComponent } from './race/race.component';
import { CapitalizefirstPipe } from './capitalizefirst.pipe';


@NgModule({
  declarations: [
    AppComponent,
    RunnersComponent,
    RacesComponent,
    RaceDetailComponent,
    MessagesComponent,
    ChartComponent,
    RaceComponent,
    CapitalizefirstPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule
  ],

  providers: [PassingService, RaceService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
