import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { ArchivosService } from './archivos.service';
import { EntidadesService } from '../../shared/services/entidades/entidades.service';
import { RegistroEnviosService } from '../registro-envios/registro-envios.service';
import { Globals } from '../../app.globals';
import { AngularFileUploaderComponent } from '../angular-file-uploader/angular-file-uploader.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { ErroresFormatoModalComponent } from '../errores-formato-modal/errores-formato-modal.component';
import { ValidacionModalComponent } from '../validacion-modal/validacion-modal.component';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./archivos.component.css'],
})
export class ArchivosComponent implements OnInit {
  @ViewChild('fileUpload')
  fileUpload: AngularFileUploaderComponent;
  displayedColumns: string[] = 
    ['id','archivos','periodo','usuarioenvio','fechahoraenvio','descripcion','abrir'];
  dataSource: any = [];
  entidades: any = [];
  periodos: any = [];  
  archivosEnviados: any = [];
  DEFAULTS: any = {
    grupoDeArchivos: [],
    grupoDeArchivo: {id: 0},
    periodo: '',
    entidad: '01',
    uploadConfig: {
      multiple: false,
      formatsAllowed: ".txt",
      filenameFormat: '',
      filenameRegExp: '',
      periodo: '',
      codigoEntidad: '',
      maxSize: "500",
      uploadAPI: {
        url: ''
      },
      hideProgressBar: false,
      hideResetBtn: false,
      hideSelectBtn: false
    },     
    ownAllowedFiles: []
  };
  grupoDeArchivos: any;
  grupoDeArchivo: any = {id: 0};
  periodo: any;
  idestado: string = 'null';
  entidad: string = '01';
  uploadConfig : any;
  ownAllowedFiles: Array<any>;
  hidden: boolean = false;
  loading: boolean = false;
  page = {
      limit: 5,
      count: 0,
      offset: 0,
      orderBy: 'fecha_hora_envio',
      orderDir: 'desc'
  };

  constructor(
    public rest:ArchivosService,
    public restRegistroEnvios: RegistroEnviosService,
    public restEntidades:EntidadesService, 
    private dialog: MatDialog,
    //private cd: ChangeDetectorRef
    //private notifier: NotifierService,
    //private authenticationService: AuthenticationService,
    //public authorizationService: AuthorizationService
  ) { 
    this.grupoDeArchivos = this.DEFAULTS.grupoDeArchivos;
    this.grupoDeArchivo.id = this.DEFAULTS.grupoDeArchivo.id;
    this.periodo = this.DEFAULTS.periodo;
    this.entidad = this.DEFAULTS.entidad;
    this.uploadConfig = this.DEFAULTS.uploadConfig;
    this.ownAllowedFiles = this.DEFAULTS.ownAllowedFiles;
    this.archivosEnviados = [];
  }

  ngOnInit() {
    /*this.grupoDeArchivos = this.DEFAULTS.grupoDeArchivos;
    this.periodo = this.DEFAULTS.periodo;
    this.entidad = this.DEFAULTS.entidad;*/


    //console.log('this.restEntidades.getEntidad------->' + this.entidad);
    
    //var arr = ["Operador"];
    //console.log(this.authorizationService.isAuthorized(arr));

    //if(this.authorizationService.isAuthorized('Admin')){

      this.restEntidades.getEntidades().
        subscribe((data: {}) => {
          this.entidades = data["data"];
          if(data["data"].length > 0 ){
            //this.entidad = data["data"][0].codigo;
           //this.changeEntidad(this.entidad);
          }
          else{
            this.entidad = this.DEFAULTS.entidad;
          }
      });
    //}
    //else{
      //this.entidad = this.authenticationService && this.authenticationService.currentUser && this.authenticationService.currentUser.company || '';      
      //
      //console.log('this.restEntidades.getEntidad');
      //console.log(this.entidad);
      //this.restEntidades.getEntidad(this.entidad).
      //  subscribe((data: {}) => {
      //    console.log('this.restEntidades.getEntidad');
      //    console.log(data["data"]);
      //    let codigo = data["data"] && data["data"].codigo || '';
      //    let nombre = data["data"] && data["data"].nombre || '';
      //    if(codigo != '' && nombre != '')
      //      this.entidades = [{'codigo': codigo, 'nombre': nombre}];
      //    else
      //      this.entidades = [{'codigo': '', 'nombre': ''}];
      //});

      this.changeEntidad(this.entidad);
    //}
  }

  changeEntidad(selected){
    this.entidad = selected;
    this.rest.getGrupoDeArchivosPorEntidad(selected).
      subscribe((data: {}) => {
        this.grupoDeArchivos = data["data"];
        if(data["data"] != null && data["data"].length > 0 ){
          this.grupoDeArchivo.id = data["data"][0].id;
        }
        else{
          this.grupoDeArchivo.id = this.DEFAULTS.grupoDeArchivo.id;
          this.periodo = this.DEFAULTS.periodo;
          this.periodos = [];
        }
        this.changeGrupoDeArchivo(this.grupoDeArchivo.id);
    });
  }

  changeGrupoDeArchivo(selected){
    if(selected == this.DEFAULTS.grupoDeArchivo.id){
      this.setDefault();
      return;
    }
    
    // 1. Obtener los periodos disponibles
    this.restRegistroEnvios.getPeriodosPorGrupoDeArchivo(this.entidad, selected).
      subscribe((dataPeriodos: {}) => {
        this.periodos = dataPeriodos["data"];
        if(dataPeriodos["data"].length > 0){
          this.periodo = dataPeriodos["data"][0];
        }
        else{
          this.periodo = this.DEFAULTS.periodo;
          this.uploadConfig = this.DEFAULTS.uploadConfig;
        }
        // 2. Obtener todos los archivos (correspondientes a la entidad, tipo de archivo y periodo) que ya se han enviado
        this.changePeriodo(this.periodo);
    });
 }

  changePeriodo(selected){
    if(this.grupoDeArchivo.id == this.DEFAULTS.grupoDeArchivo.id && this.periodo == this.DEFAULTS.periodo){
      this.setDefault();
      return;
    }
//   // TODO: esto se debería hacer en la capa de servicios, pendiente
    //let usuario = JSON.parse(localStorage.getItem('usuario'));
    //if (!(usuario && usuario.access_token)) {      
    //  this.notifier.notify('error', 'Usuario expirado');
    //}
   this.uploadConfig = {
      multiple: true,
      maxSize: "500",
      uploadAPI: {
        url: `${Globals.api}/archivos/${this.grupoDeArchivo.id}/periodo/${this.periodo}/entidad/${this.entidad}/uploads`,
        //headers: {
        //  //"Content-Type" : "text/plain;charset=UTF-8",
        //  "Authorization" :  `Bearer ${usuario.access_token}`}
      },
      hideProgressBar: false,
      hideResetBtn: false,
      hideSelectBtn: false
    };
        
    // 1. Obtener la lista de archivos que corresponden al grupo de archivo
    this.rest.getGrupoDeArchivos(this.entidad, this.grupoDeArchivo.id).
      subscribe((dataGrupoArchivos: {}) => {
        if(dataGrupoArchivos["status"] == "success"){
         let auxArchivos = dataGrupoArchivos["data"];
          let auxEntidad = this.entidad;
          let aaaa = this.periodo.substring(0, 4);
          let mm = this.periodo.substring(4, 6);
          let dd = this.periodo.length > 6? this.periodo.substring(6, 8): '';
                    
          auxArchivos.forEach(
            function(obj) {
              obj.NombreArchivo = obj.formatoNombre.replace("AAAA", aaaa);
              obj.NombreArchivo = obj.NombreArchivo.replace("MM", mm);
              obj.NombreArchivo = obj.NombreArchivo.replace("DD", dd);
              obj.NombreArchivo = obj.NombreArchivo.replace("EEEE", auxEntidad); // se debe buscar si la sigla es EEEE o EEE o EE
              obj.NombreArchivo = obj.NombreArchivo.replace("EEE", auxEntidad);
              obj.NombreArchivo = obj.NombreArchivo.replace("EE", auxEntidad);
              obj.NombreArchivo = obj.NombreArchivo.toLowerCase();
              obj.Seleccionado = "false";
              obj.MensajeDeError;
            });
         this.ownAllowedFiles = auxArchivos;
        }
        else{
          //this.notifier.notify('error', dataGrupoArchivos["message"]);
        }
    });
   //this.fileUpload.resetFileUpload(); // ver esto
    this.setPage({offset: 0});
  }
  
  /**
   * Llena la tabla con nuevos datos obtenidos en base al número de página
   * 
   * @param {any} page: objeto con los atributos  { {number}limit, {number}count, {number}offset, {string}orderBy,  {string}orderDir}
   */
  setPage(pageInfo){
    this.loading = true;
    this.page.offset = pageInfo.offset;
    this.restRegistroEnvios.getArchivosEnviados(this.grupoDeArchivo.id, this.entidad, this.periodo, '' , this.page.limit, (this.page.orderDir == 'desc'? '-': '') + this.page.orderBy, this.page.offset)
        .subscribe((data: {}) => {
            this.page.count = data["count"];
            this.archivosEnviados = data["data"];
            for (let i = 0; i < this.archivosEnviados.length; i++){
              this.idestado = this.archivosEnviados[i].idestado;
              if(this.idestado == '4'){
                this.archivosEnviados.id = this.archivosEnviados[i].id;
                //console.log(this.idestado);
                //console.log(this.archivosEnviados.id);
                this.Transformacion(this.archivosEnviados.id);
              }
              else{
                //console.log('prueba'+ i +this.idestado);
              }  
             }
            //console.log(this.archivosEnviados);
            this.loading = false;
        });

  }

/**
   * Llena la tabla con nuevos datos obtenidos en base al número de página
   * 
   * @param {id_recepcion}: objeto con los atributos  { {number}limit, {number}count, {number}offset, {string}orderBy,  {string}orderDir}
   */
  Transformacion(id){
    console.log(id);

  }



  /**
   * Se ordena la tabla de acuerdo a la columna seleccionada
   * 
   * @param event: objeto de la libreria ngx-datatable 
   */
  setDefault(){
    this.page = {
      limit: 5,
      count: 0,
      offset: 0,
      orderBy: 'fecha_hora_envio',
      orderDir: 'desc'
    };
    this.grupoDeArchivos = this.DEFAULTS.grupoDeArchivos;
    this.grupoDeArchivo.id = this.DEFAULTS.grupoDeArchivo.id;
    this.periodo = this.DEFAULTS.periodo;
    this.entidad = this.DEFAULTS.entidad;
    this.uploadConfig = this.DEFAULTS.uploadConfig;
    this.ownAllowedFiles = this.DEFAULTS.ownAllowedFiles;
    this.archivosEnviados = [];
  }

  DocUpload(env) {
    // 1. Se verifica la respuesta del api de carga de archivos
    var obj = JSON.parse(env.response);
    if(obj.status == "success"){
      this.fileUpload.resetFileUpload();
      // 2. se invoca al método que valida el formato
      this.restRegistroEnvios.getValidarFormato(obj.data).
        subscribe((data: {}) => {
          if(data["status"] == "error"){
            // abre los errores en un Popup
            this.abrirErrores(obj.data, data["message"]);
          }
          else{
            // 3. Se muestra un popup con un mensaje
            let dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.data = {
              cancelarBtn: false,
              aceptarBtn: true,
              titulo: 'Correcto',
              descripcion: 'Se ha cargado los archivos correctamente. Se procecerá a verificar la consistencia de los datos.'
            }
            let dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
              if (result == 'confirm') {
                // 4. Se actualizará los componentes de la página
                this.changeGrupoDeArchivo(this.grupoDeArchivo.id);
              }
            });
          }
      });
    }
    else{
      // Si existe algun error, se muestra el mensaje
      let dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        cancelarBtn: false,
        aceptarBtn: true,
        titulo: 'Tiene errores',
        descripcion: obj.message + /*'<br />' +*/ 'No se ha cargado el archivo'
      }
      let dialogRef = this.dialog.open(MessageBoxComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'confirm') {
          this.changePeriodo(this.periodo);
        }
      });
    }
  }
  /**

  * Abre el validador de periodo cargado
   * @param {int} idRecepcion : id de la recepcion
   * @param {int} idgrupoarchivo : mensaje de error, por defecto ''
   */
  abrirValidacion(idRecepcion: number, idgrupoarchivo: number) {
     
    console.log(this.entidad);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: idRecepcion,
      idgrupoarchivo: idgrupoarchivo
    };

    let dialogRef = this.dialog.open(ValidacionModalComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      var dialogResult = result;
      // ACTUALIZAR LA TABLA DE ARCHIVOS ENVIADOS
      this.changePeriodo(this.periodo);
    });
  }
    /**

   * Abre los errores en un popup
   * @param {int} idRecepcion : id de la recepcion
   * @param {string} message : mensaje de error, por defecto ''
   */
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
      var dialogResult = result;
      // ACTUALIZAR LA TABLA DE ARCHIVOS ENVIADOS
      this.changePeriodo(this.periodo);
    });
  }


}
