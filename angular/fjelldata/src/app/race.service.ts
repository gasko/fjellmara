import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Race, RaceEnum } from './race';
import { MessageService } from './message.service';
import { RACES, CHECKPOINTS_FJALLMARA } from './mock-races';

@Injectable()
export class RaceService {

  constructor(private messageService: MessageService) { }

  getRaces(): Observable<Race[]> {
    this.messageService.add('RaceService: fetched races');
    return of(RACES);
  }

  getCheckpoints(race: RaceEnum): Observable<Checkpoint[]> {
    this.messageService.add('RaceService: fetched checkpoint');
    if(race == FJALLMARA){
      return of(CHECKPOINTS_FJALLMARA);
    }
    else if(race == S27K){
      return of(CHECKPOINTS_27K);
    }
  }



}
