import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RegistroEnviosService } from '../registro-envios/registro-envios.service';

@Component({
  selector: 'app-errores-formato-modal',
  templateUrl: './errores-formato-modal.component.html',
  styleUrls: ['./errores-formato-modal.component.css']
})
export class ErroresFormatoModalComponent implements OnInit{
  description:string;
  displayedColumns: string[] = 
  ['Archivo','Fila','Columna','Mensaje','Fecha'];
  dataSource: any = [];
  datos: any;
  archivoEnviado: any = {nombreArchivo: '', fechaHoraEnvio: '', usuarioEnvio: ''};
  rows: any = [];
  loading: boolean = false;
  page = {
      limit: 5,
      count: 0,
      offset: 0,
      orderBy: '',
      orderDir: 'asc'
  };

  constructor(
      private dialogRef: MatDialogRef<ErroresFormatoModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data : any,
      public rest:RegistroEnviosService
  ) {
      this.datos = data;
      //console.log('constructor');
      //console.log(this.datos);
  }

  ngOnInit() {
      this.dialogRef.updateSize("80%");
      this.rows = [];
      if(this.datos.id == null){
          this.datos.descripcion = 'No se tiene el identificador del envío del archivo.';
      }
      else{
          // invocar al metodo que retorna el detalle de la recepcion
          /**/
          this.rest.getArchivoEnviado(this.datos.id).subscribe((data: {}) => {

              this.archivoEnviado = data["data"];
              //console.log(data["data"]);
          });
          /**/
          this.setPage({offset: 0});
      }
  }
  
  /**
   * Populate the table with new data based on the page number
   * Llena la tabla con nuevos datos obtenidos en base al número de página
   * @param {any} page: objeto con los atributos  { {number}limit, {number}count, {number}offset, {string}orderBy,  {string}orderDir}
   */
  setPage(pageInfo){
      this.loading = true;
      this.page.offset = pageInfo.offset;
      this.rest.getErroresFormato(this.datos.id, '' , this.page.limit, (this.page.orderDir == 'desc'? '-': '') + this.page.orderBy, this.page.offset)
          .subscribe((data: {}) => {
              //console.log(data["data"]);
              this.page.count = data["count"];
              this.rows = data["data"];  
              this.loading = false;
          });
  }

  /**
   * Se ordena la tabla de acuerdo a la columna seleccionada
   * 
   * @param event: objeto de la libreria ngx-datatable 
   */
  onSort(event) {
      // event was triggered, start sort sequence
      console.log('Sort Event', event);
      const sort = event.sorts[0];        
      this.page.orderBy = sort.prop;
      this.page.orderDir = sort.dir;
      this.setPage({offset: 0});
  }

  close() {
      this.dialogRef.close();
  }
}

