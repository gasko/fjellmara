import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Passing } from './passing';,
import { MessageService } from './message.service';
import { PASSINGS17, PASSINGS16, PASSINGS15 } from './mock-passing';


@Injectable()
export class PassingService {

  constructor(private messageService: MessageService) { }
  getPassings(year:number): Observable<Passing[]> {
    this.messageService.add('PassingService: fetched passings');
    if(year==2015){
        return of(PASSINGS15);
    } else if (year==2016) {
      return of(PASSINGS16);
    } else if (year==2017) {
      return of(PASSINGS17);
    }

  }
}
