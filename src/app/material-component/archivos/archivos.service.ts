import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Globals } from '../../app.globals';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  private url: string = '';
  
  /**
   * Constructor
   * 
   * @param {HttpClient} http : se inyecta un objeto de la clase HttpClient
   */
  constructor (private http: HttpClient) {
    this.url = Globals.api + '/archivos';
  }
  /**
   * Obtiene los archivos enviados por una entidad en un periodo.
   * 
   * @param {number} idArchivo: Id del archivo.
   * @param {string} entidad: Código de la entidad.
   * @param {string} periodo: Periodo de proceso.
   * @param {string} filter : texto que sirve para filtrar la tabla
   * @param {number} limit : número de elementos por página
   * @param {string} order : nombre de la columna con el que se ordena el resultado. Se debe añadir "-" delante del nombre si se quiere ordenar en forma descendente.
   * @param {number} page : número de página
  
  getArchivosEnviados(idArchivo, entidad, periodo, filter:string = "", limit: number= 5, order: string = "", page: number = 0): Observable<any> {
    console.log('getErroresFormato: '+ `${this.url}/${idArchivo}/entidad/${entidad}/periodo/${periodo}?filter=${filter}&limit=${limit}&order=${order}&page=${page}`);
    return this.http.get<any>(`${this.url}/${idArchivo}/entidad/${entidad}/periodo/${periodo}?filter=${filter}&limit=${limit}&order=${order}&page=${page}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivosEnviados', []))
      );
  }
  */

  /**
   * Obtiene los grupos de archivos asignados a una entidad.
   * 
   * @param {string} entidad: Código de la entidad
   */
  getGrupoDeArchivosPorEntidad(entidad): Observable<any> {
    return this.http.get<any>(`${this.url}/entidad/${entidad}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getGrupoDeArchivosPorEntidad', {status: 'error', data: []}))
      );
  }

  /**
   * Obtiene la lista de archivos de un grupo de archivos
   * 
   * @param {string} entidad : Código de la entidad
   * @param {number} idGrupoDeArchivo : id del grupo de Archivos (tabla grupo_archivos.id)
   */
  getGrupoDeArchivos(entidad, idGrupoDeArchivo): Observable<any> {
    return this.http.get<any>(`${this.url}/entidad/${entidad}/grupo/${idGrupoDeArchivo}/detalle`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivos', []))
      );
  }

  /**
   * SE BORRARÁ
   * Obtiene el detalle de un archivo
   * 
   * @param {number} id : id del Archivo (tabla archivos.id)
   */
  getArchivo(id): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}/detalle`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivo', []))
      );
  }

  /**
   * Función para manejar los errores en las llamadas a los APIs. En desarrollo
   * 
   * @param operation 
   * @param result 
   */
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
  
  /**
   * Función para centralizar / personalizar los logs. En desarrollo
   * 
   * @param message 
   */
  private log(message: string) {
    console.log('ArchivosService: ' + message);
  }  
}
