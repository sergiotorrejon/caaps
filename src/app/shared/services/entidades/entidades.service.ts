import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from '../../../app.globals';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private url: string = '';

  /**
   * Constructor
   * 
   * @param {HttpClient} http : se inyecta un objeto de la clase HttpClient
   */
  constructor (private http: HttpClient) {
    this.url = Globals.api;
  }
  
  getEntidades(): Observable<any> {
    return this.http.get<any>(`${this.url}/entidades`)
      //.pipe(
      //  //tap(heroes => this.log(`fetched users`)),
      //  catchError(this.handleError('getEntidades', []))
      //);
  }
  getEntidad(codigo): Observable<any> {
    return this.http.get<any>(`${this.url}/entidades/${codigo}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getEntidades', []))
      );
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }
    
  private log(message: string) {
    console.log('EntidadesService: ' + message);
  }
}

