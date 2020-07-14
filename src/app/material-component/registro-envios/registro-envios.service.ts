import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Globals } from '../../app.globals';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({
  providedIn: 'root'
})
export class RegistroEnviosService /*extends SomeParent*/ {

  private url: string = '';
  private urlvalorcuota: string = '';

  /**
   * Constructor
   * 
   * @param {HttpClient} http : se inyecta un objeto de la clase HttpClient
   */
  constructor (private http: HttpClient) {
    this.url = Globals.api + '/recepcion';
    this.urlvalorcuota = Globals.api + '/valorcuota';
  }

  /**
   * Obtiene el detale de la recepción del archivo
   * 
   * @param {number} id : id de la recepcion
   */
  getArchivoEnviado(id): Observable<any> {
    //console.log('getArchivoEnviado: '+ `${this.url}/${id}`);
    return this.http.get<any>(`${this.url}/${id}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivoEnviado', []))
      );
  }

  /**
   * Obtiene el detale de la recepción del archivo completo
   * 
   * @param {number} id : id de la recepcion
   */
  getArchivoEnviadoRecepcionado(id): Observable<any> {
    //console.log('getArchivoEnviado: '+ `${this.url}/${id}`);
    return this.http.get<any>(`${this.url}/recepcionado/${id}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivoEnviado', []))
      );
  }

    /**
   * Obtiene el detale de la recepción del archivo completo
   * 
   * @param {number} id : id de la recepcion
   */
  getRegistroValorCuota(id): Observable<any> {
    //console.log('getArchivoEnviado: '+ `${this.url}/${id}`);
    return this.http.get<any>(`${this.urlvalorcuota}/registrovc/${id}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivoEnviado', []))
      );
  }
  
  /**
   * Obtiene los grupos de archivos asignados a una entidad. Se debe modificar el endpoint (API) para que se obtenga todos los grupos de archivos asignados a una entidad
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
   * Obtiene los archivos enviados por una entidad en un periodo.
   * 
   * @param {number} idArchivo: Id del archivo.
   * @param {string} entidad: Código de la entidad.
   * @param {string} periodo: Periodo de proceso.
   * @param {string} filter : texto que sirve para filtrar la tabla
   * @param {number} limit : número de elementos por página
   * @param {string} order : nombre de la columna con el que se ordena el resultado. Se debe añadir "-" delante del nombre si se quiere ordenar en forma descendente.
   * @param {number} page : número de página
   */
  getArchivosEnviados(idArchivo, entidad, periodo, filter:string = "", limit: number= 5, order: string = "", page: number = 0, estado = -1, usuario = ""): Observable<any> {
    //console.log('getArchivosEnviados: '+ `${this.url}/${idArchivo}/entidad/${entidad}/periodo/${periodo}?filter=${filter}&limit=${limit}&order=${order}&page=${page}&estado=${estado}&usuario=${usuario}`);
    return this.http.get<any>(`${this.url}/${idArchivo}/entidad/${entidad}/periodo/${periodo}?filter=${filter}&limit=${limit}&order=${order}&page=${page}&estado=${estado}&usuario=${usuario}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivosEnviados', []))
      );
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
   * @param {number} estado : estado de la recepción del archivo (de acuerdo a los registros de la tabla parametros.estados)
   * @param {string} usuario : usuario que realizó el envió
   */
  getArchivosEnviadosHistorico(idArchivo, entidad, periodo, filter:string = "", limit: number= 5, order: string = "", page: number = 0, estado = -1, usuario = ""): Observable<any> {
    //console.log('getErroresFormato: '+ `${this.url}/historico/${idArchivo}/entidad/${entidad}/periodo/${periodo}?filter=${filter}&limit=${limit}&order=${order}&page=${page}&estado=${estado}&usuario=${usuario}`);
    return this.http.get<any>(`${this.url}/historico/${idArchivo}/entidad/${entidad}/periodo/${periodo}?filter=${filter}&limit=${limit}&order=${order}&page=${page}&estado=${estado}&usuario=${usuario}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getArchivosEnviados', []))
      );
  }

  /**
   * Obtiene los periodos disponibles para un archivo. En desarrollo
   * @todo se debe enviar el código de la entidad, esto para permitir reprocesos
   * 
   * @param {string} entidad : Código de la entidad
   * @param {number} idGrupoDeArchivo : id del grupo de Archivo (tabla grupo_archivos.id)
   */
  getPeriodosPorGrupoDeArchivo(entidad, idGrupoDeArchivo): Observable<any> {
    //return of({status: 'success', data: [{id: '201809', nombre: '201809'}, {id: '201808', nombre: '201808'}, {id: '201807', nombre: '201807'}]});
    //console.log(`${this.url}/periodosDisponibles/entidad/${entidad}/archivo/${idGrupoDeArchivo}`);
    return this.http.get<any>(`${this.url}/periodosDisponibles/entidad/${entidad}/archivo/${idGrupoDeArchivo}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getGrupoDeArchivosPorEntidad', {status: 'error', data: []}))
      );
  }

  /**
   * Obtiene todos los periodos procesados de un archivo y una entidad. En desarrollo.
   * @todo se debe enviar el código de la entidad, esto para permitir reprocesos
   * 
   * @param {number} idArchivo : id del Archivo (tabla archivos.id)
   * @param {string} idEntidad : id o código de la entidad
   */
  getPeriodosProcesados(idArchivo, idEntidad): Observable<any> {    
    return this.http.get<any>(`${this.url}/periodosProcesados/entidad/${idEntidad}/archivo/${idArchivo}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getPeriodosProcesados', []))
      );
  }

  /**
   * Invoca al método de validación de formato
   * 
   * @param {number} id : id del envio del archivo (columna recepcion.id)
   */
  getValidaPeriodo(id): Observable<any> {
    return this.http.get<any>(`${this.urlvalorcuota}/validaPeriodo/${id}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getValidaPeriodo', {status: 'error', message: 'No se pudo acceder al servicio', data: []}))
      );
  }

  /**
   * Invoca al método de validación de formato
   * 
   * @param {number} id : id del envio del archivo (columna recepcion.id)
   */
  getValidarFormato(id): Observable<any> {
    return this.http.get<any>(`${this.url}/validarFormato/${id}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getValidarFormato', {status: 'error', message: 'No se pudo acceder al servicio', data: []}))
      );
  }

  /**
   * Obtiene la lista de los errores de formato que fueron detectados
   * 
   * @param {number} id : id de la recepción 
   * @param {string} filter : texto que sirve para filtrar la tabla
   * @param {number} limit : número de elementos por página
   * @param {string} order : nombre de la columna con el que se ordena el resultado. Se debe añadir "-" delante del nombre si se quiere ordenar en forma descendente.
   * @param {number} page : número de página
   */
  getErroresFormato(id: number, filter:string = "", limit: number= 5, order: string = "", page: number = 0): Observable<any> {
    //console.log('getErroresFormato: '+ `${this.url}/erroresFormato/${id}?filter=${filter}&limit=${limit}&order=${order}&page=${page}`);
    return this.http.get<any>(`${this.url}/erroresFormato/${id}?filter=${filter}&limit=${limit}&order=${order}&page=${page}`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getErroresFormato', []))
      );
  }

  //26/09/2018


  /**
   * Obtiene la lista de los tipos de estados en los que se encuentra las recepciones
   */
  getEstados(): Observable<any> {    
    return this.http.get<any>(`${this.url}/estados`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getEstados', []))
      );
  }

  /**
   * Invoca al método de validación de formato
   * 
   * @param {string} id : id del envio del archivo (columna recepcion.id)
   */
  getUsuariosPorEntidad(entidad): Observable<any> {
    return this.http.get<any>(`${this.url}/entidad/${entidad}/usuarios`)
      .pipe(
        //tap(heroes => this.log(`fetched users`)),
        catchError(this.handleError('getUsuariosPorEntidad', []))
      );
  }
  //26/09/2018


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
    console.log('RegistroEnviosService: ' + message);
  }
}
