import { Component, OnInit } from '@angular/core';
import { RegistroEnviosService } from './registro-envios.service';
import { ArchivosService } from '../archivos/archivos.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EntidadesService } from '../../shared/services/entidades/entidades.service';
import { ErroresFormatoModalComponent } from '../errores-formato-modal/errores-formato-modal.component';

@Component({
  selector: 'app-registro-envios',
  templateUrl: './registro-envios.component.html',
  styleUrls: ['./registro-envios.component.css']
})
export class RegistroEnviosComponent implements OnInit {
  displayedColumns: string[] = 
  ['id','archivos','periodo','usuarioenvio','fechahoraenvio','descripcion','abrir'];
  dataSource: any = [];
  entidades: any = [];
  periodos: any = [];  
  archivosEnviados: any = [];
  DEFAULTS: any = {
    grupoDeArchivos: [],
    grupoDeArchivo: {id: 0, nombre: ''},
    periodo: '201801',
    entidad: '0', 
  };

  grupoDeArchivos: any;
  grupoDeArchivo: any;
  periodo: any;
  entidad: any;
  loading: boolean = false;
  page = {
      limit: 5,
      count: 0,
      offset: 0,
      orderBy: 'fecha_hora_envio',
      orderDir: 'desc'
  };

  constructor(
    public rest:RegistroEnviosService,
    public restArchivos:ArchivosService, 
    public restEntidades:EntidadesService, 
    private dialog: MatDialog,
    //private authenticationService: AuthenticationService,
    //public authorizationService: AuthorizationService
  ) {
    this.grupoDeArchivos = this.DEFAULTS.grupoDeArchivos;
    this.grupoDeArchivo = this.DEFAULTS.grupoDeArchivo;
    this.periodo = this.DEFAULTS.periodo;
    this.entidad = this.DEFAULTS.entidad;
    this.archivosEnviados = [];
  }

  abrirErrores(idRecepcion: number, message: string = '') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: idRecepcion,
      descripcion: message
    };

    let dialogRef = this.dialog.open(ErroresFormatoModalComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog closed: ${result}`);
      var dialogResult = result;
      // ACTUALIZAR LA TABLA DE ARCHIVOS ENVIADOS
      this.changePeriodo(this.periodo);
    });
  }

  ngOnInit() {
    this.grupoDeArchivos = this.DEFAULTS.grupoDeArchivos;
    this.periodo = this.DEFAULTS.periodo;
    this.entidad = this.DEFAULTS.entidad;

    //if(this.authorizationService.isAuthorized('Admin')){
      this.restEntidades.getEntidades().
        subscribe((data: {}) => {
          this.entidades = data["data"];
          if(data["data"].length > 0 ){
            this.entidad = data["data"][0].codigo;
            this.changeEntidad(this.entidad);
          }
          else
            this.entidad = this.DEFAULTS.entidad;
      });
    //}
    //else{
    //  this.entidad = this.authenticationService && this.authenticationService.currentUser && this.authenticationService.currentUser.company || '';      
    //  
    //  this.restEntidades.getEntidad(this.entidad).
    //    subscribe((data: {}) => {
    //      let codigo = data["data"] && data["data"].codigo || '';
    //      let nombre = data["data"] && data["data"].nombre || '';
    //      if(codigo != '' && nombre != '')
    //        this.entidades = [{'codigo': codigo, 'nombre': nombre}];
    //      else
    //        this.entidad = this.DEFAULTS.entidad;
    //  });
//
    //  this.changeEntidad(this.entidad);
    //}
  }

  /**
   * Se activa cuando se cambia un valor de la lista de entidades
   * 
   * @param selected Opción seleccionada
   */
  changeEntidad(selected){
    this.entidad = selected;
    this.restArchivos.getGrupoDeArchivosPorEntidad(selected).
      subscribe((data: {}) => {
        this.grupoDeArchivos = data["data"];
        if(data["data"].length > 0 ){
          this.grupoDeArchivo.id = data["data"][0].id;
          this.changeGrupoDeArchivo(this.grupoDeArchivo.id);
        }
        else{
          this.grupoDeArchivo = this.DEFAULTS.grupoDeArchivo;
        }
    });
  }

  /**
   * EN DESARROLLO
   * Se activa cuando se cambia un valor de la lista de grupo de archivos
   * 
   * @param selected Opción seleccionada
   */
  changeGrupoDeArchivo(selected){
    // 1. Obtener los periodos disponibles
    this.rest.getPeriodosProcesados(selected, this.entidad).
      subscribe((dataPeriodos: {}) => {
        this.periodos = dataPeriodos["data"];
        if(dataPeriodos["data"].length > 0){
          this.periodo = dataPeriodos["data"][0];

          // 2. Obtener todos los archivos (correspondientes a la entidad, tipo de archivo y periodo) que ya se han enviado
          this.changePeriodo(this.periodo);
        }
        else{
          this.archivosEnviados = [];
          this.page = {
            limit: 5,
            count: 0,
            offset: 0,
            orderBy: 'fecha_hora_envio',
            orderDir: 'desc'
        };
          this.periodo = this.DEFAULTS.periodo;
        }
    });
  }

  changePeriodo(selected){
    this.setPage({offset: 0});
  }
  
  /**
   * Populate the table with new data based on the page number
   * Llena la tabla con nuevos datos obtenidos en base al número de página
   * @param {any} page: objeto con los atributos  { {number}limit, {number}count, {number}offset, {string}orderBy,  {string}orderDir}
   */
  setPage(pageInfo){
    this.loading = true;
    this.page.offset = pageInfo.offset;
    this.rest.getArchivosEnviadosHistorico(this.grupoDeArchivo.id, this.entidad, this.periodo, '' , this.page.limit, (this.page.orderDir == 'desc'? '-': '') + this.page.orderBy, this.page.offset)
        .subscribe((data: {}) => {
            this.page.count = data["count"];
            this.archivosEnviados = data["data"];            
            this.loading = false;
        });
  }

  /**
   * Se ordena la tabla de acuerdo a la columna seleccionada
   * 
   * @param event: objeto de la libreria ngx-datatable 
   */
  onSort(event) {
      const sort = event.sorts[0];
      this.page.orderBy = sort.prop;
      this.page.orderDir = sort.dir;
      this.setPage({offset: 0});
  }

}
