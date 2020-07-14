import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RegistroEnviosService } from '../registro-envios/registro-envios.service';

@Component({
  selector: 'app-validacion-modal',
  templateUrl: './validacion-modal.component.html',
  styleUrls: ['./validacion-modal.component.css']
})
export class ValidacionModalComponent implements OnInit{
  description:string;
  datos: any;
  archivoEnviado: any = {id: '', idEntidad: '', fechaHoraEnvio: ''};
  rows: any = [];
  RegistroValorCuota: any = [];
  displayedColumns: string[] = 
  ['id','idEntidad','periodo','valorCuota','valorFci','rentabilidadDiaria','rentabilidadMensual','validar'];
  loading: boolean = false;
  page = {
      limit: 5,
      count: 0,
      offset: 0,
      orderBy: '',
      orderDir: 'asc'
  };

  constructor(
      private dialogRef: MatDialogRef<ValidacionModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data : any,
      public rest:RegistroEnviosService
  ) {
      this.datos = data;

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
          //console.log(this.datos.id);
          this.rest.getArchivoEnviado(this.datos.id).
          subscribe((data: {}) => {
              this.archivoEnviado = data["data"];
          });
          this.rest.getRegistroValorCuota(this.datos.id).
          subscribe((data: {}) => {
            this.RegistroValorCuota = data["data"];
            console.log(this.RegistroValorCuota);
          });
      }
  }
  
  validar() {
    //console.log(this.archivoEnviado.id);
    this.rest.getValidaPeriodo(this.archivoEnviado.id).
    subscribe((data: {}) => {


    });
    this.dialogRef.close();
}

  close() {
      this.dialogRef.close();
  }
}
