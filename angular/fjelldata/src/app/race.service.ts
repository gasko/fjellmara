import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Race, RaceEnum } from './race';
import { MessageService } from './message.service';
import { RACES, CHECKPOINTS_FJALLMARA } from './mock-races';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RaceService {

  private racesUrl = 'http://localhost/fjellmara/backend_get_races.php';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // getRaces(): Observable<Race[]> {
  //   this.messageService.add('RaceService: fetched races');
  //   return of(RACES);
  // }

  getRaces(): Observable<Race[]> {
    console.log(this.racesUrl);
    return this.http.get<Race[]>(this.racesUrl);

  //  return this.http.get("http://localhost/fjellmara/backend_get_races.php").map((response:Response) => response.json());
  }

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

  getCheckpoints(race: RaceEnum): Observable<Checkpoint[]> {
    // this.messageService.add('RaceService: fetched checkpoint');
    // if(race == FJALLMARA){
    //   return of(CHECKPOINTS_FJALLMARA);
    // }
    // else if(race == S27K){
    //   return of(CHECKPOINTS_27K);
    // }
  }



}
