import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Passing } from './passing';
import { Race } from './race';
import { Checkpoint } from './checkpoint';
import { CheckpointStat } from './checkpointStat';
import { MessageService } from './message.service';
import { PASSINGS17, PASSINGS16, PASSINGS15 } from './mock-passing';
import { catchError, map, tap } from 'rxjs/operators';
import { AppGlobals } from './app.global';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {

  phpPath:string = "";

  constructor(
    private messageService: MessageService,
    private http: HttpClient)
    {
      this.phpPath = AppGlobals.PHP_PATH;
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
        console.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }


  getRaces(): Observable<Race[]> {
    this.messageService.add('DataService: fetched races');
    var fetchUrl = this.phpPath + 'backend_get_races.php';
    return this.http.get<Race[]>(fetchUrl);
  //  return this.http.get("http://localhost/fjellmara/backend_get_races.php").map((response:Response) => response.json());
  }

  getPassings(race:string, checkpoint:string, year:number): Observable<Passing[]> {
    this.messageService.add('DataService: fetched passings');
    var fetchUrl = this.phpPath + 'backend_get_passings?race='+race+'&year='+year+'&checkpoint='+checkpoint;
    return this.http.get<Passing[]>(fetchUrl);
  }

  getStats(race:string, checkpoint:string): Observable<CheckpointStat> {
    this.messageService.add('DataService: fetched stats');
    let fetchUrl = this.phpPath + 'backend_get_checkpoint_stat.php?race='+race+'&checkpoint='+checkpoint;
    return this.http.get<CheckpointStat>(fetchUrl);
  }

  getCheckpoints(race:string): Observable<Checkpoint[]> {
    this.messageService.add('DataService: fetched checkpoints');
    let fetchUrl = this.phpPath + 'backend_get_checkpoints.php?race='+race;
    return this.http.get<Checkpoint[]>(fetchUrl);
  }

  getRunner(race:string, year:number, bib:number): Observable<RunnerExt> {
    this.messageService.add('DataService: fetched runner');
    let fetchUrl = this.phpPath + 'backend_get_runner.php?race='+race+'&year='+year+'&bib='+bib;
    return this.http.get<RunnerExt>(fetchUrl);
  }
}
