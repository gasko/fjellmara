import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Passing } from './passing';
import { Checkpoint } from './checkpoint';
import { CheckpointStat } from './checkpointStat';
import { MessageService } from './message.service';
import { PASSINGS17, PASSINGS16, PASSINGS15 } from './mock-passing';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PassingService {



  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }


  getPassings(race:string, checkpoint:string, year:number): Observable<Passing[]> {
    this.messageService.add('PassingService: fetched passings');
    console.log(year);

    var passingsUrl = 'http://localhost/fjellmara/backend_get_passings?race='+race+'&year='+year+'&checkpoint='+checkpoint;

   return this.http.get<Passing[]>(passingsUrl);

    if(year==2015){
        return of(PASSINGS15);
    } else if (year==2016) {
      return of(PASSINGS16);
    } else if (year==2017) {
      return of(PASSINGS17);
    }
  }

  getStats(race:string, checkpoint:string): Observable<Passing[]> {
    this.messageService.add('PassingService: fetched stats');
    let fetchUrl = 'http://localhost/fjellmara/backend_get_checkpoint_stat.php?race='+race+'&checkpoint='+checkpoint;
    return this.http.get<Stat>(fetchUrl);
  }

  getCheckpoints(race:string): Observable<Checkpoint[]> {
    this.messageService.add('PassingService: fetched checkpoints');
    let fetchUrl = 'http://localhost/fjellmara/backend_get_checkpoints.php?race='+race;
    return this.http.get<Stat>(fetchUrl);
  }
}
