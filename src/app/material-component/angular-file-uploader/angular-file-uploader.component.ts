import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-angular-file-uploader',
  templateUrl: './angular-file-uploader.component.html',
  styleUrls: ['./angular-file-uploader.component.scss']
})
export class AngularFileUploaderComponent implements OnInit, OnChanges {
  @Input() config: any;
  @Input() allowedFiles: Array<any>;
  @Output() resetUpload: boolean;
  @Output() ApiResponse: EventEmitter<{}>;

  id: number;
  hideProgressBar: boolean;
  maxSize: number;
  uploadAPI: string;
  multiple: boolean;
  headers: any;
  hideResetBtn: boolean;
  hideSelectBtn: boolean;
  attachPinText: string;
  uploadBtnText: string;
  idDate: number;
  selectedFiles: Array<any>;
  selectedFilesLabels: Array<any>;
  progressBarShow: boolean;
  uploadBtn: boolean;
  uploadMsg: boolean;
  afterUpload: boolean;
  uploadClick: boolean;
  uploadMsgText: string;
  uploadMsgClass: string;
  percentComplete: number;

  constructor(
      //private authenticationService: AuthenticationService,
      //private notifier: NotifierService
  ) {
      this.config = {};
      this.resetUpload = this.config["resetUpload"];
      this.ApiResponse = new EventEmitter();
      this.idDate = +new Date();
      this.allowedFiles = [];
      
      this.selectedFiles = [];
      this.selectedFilesLabels = [];
      this.progressBarShow = false;
      this.uploadBtn = false;
      this.uploadMsg = false;
      this.afterUpload = false;
      this.uploadClick = true;
      this.uploadMsgText = "";
  }
  /**
   * @param {?} rst
   * @return {?}
   */
  ngOnChanges(rst) {
      if (rst["config"]) {
          this.id =
              this.config["id"] ||
                  parseInt((this.idDate / 10000).toString().split(".")[1]) + Math.floor(Math.random() * 20) * 10000;
          this.hideProgressBar = this.config["hideProgressBar"] || false;
          this.hideResetBtn = this.config["hideResetBtn"] || false;
          this.hideSelectBtn = this.config["hideSelectBtn"] || false;
          this.uploadBtnText = this.config["uploadBtnText"] || "Enviar";
          this.maxSize = this.config["maxSize"] || 20;
          this.uploadAPI = this.config["uploadAPI"]["url"];
          this.multiple = this.config["multiple"] || false;
          this.headers = this.config["uploadAPI"]["headers"] || {};
          this.attachPinText = this.config["attachPinText"] || "Attach supporting documents..";
          this.uploadMsgText = this.config["uploadMsgText"] || "...";
      }
      if (rst["resetUpload"]) {
          if (rst["resetUpload"].currentValue === true) {
              this.resetFileUpload();
          }
      }
  }
  /**
   * @return {?}
   */
  ngOnInit() {
      //console.log("Id: ", this.id);
      this.resetUpload = false;
  }

  /**
   * @return {?}
   */
  resetFileUpload() {
      for (var i in this.allowedFiles)
          this.allowedFiles[i].seleccionado = '';
  
      this.allowedFiles = [...this.allowedFiles];

      this.selectedFilesLabels = [];
      this.selectedFiles = [];
      this.uploadMsg = false;
      this.uploadBtn = false;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  onChange(event) {
      //this.selectedFiles = [];

      // revisar el uso de la variable this.afterUpload
      /*if (this.afterUpload || !this.multiple) {
          this.allowedFiles = [];
          //this.selectedFilesLabels = [];
          this.afterUpload = false;
      }*/

      //ITERATE SELECTED FILES
      let /** @type {?} */ file;
      if (event.type == "drop") {
          file = event.dataTransfer.files;
      }
      else {
          file = event.target.files || event.srcElement.files;
      }

      if( this.selectedFilesLabels.length + file.length > this.allowedFiles.length){
          //this.notifier.notify('error', 'No se puede seleccionar más de ' + this.allowedFiles.length + ' archivos');
          return;
      }
      
      // verificar si el/los archivos seleccionados recientemente no están en selectedFiles
      for (let /** @type {?} */ i = 0; i < file.length; i++) {
          console.log('==========================>');
          console.log('============= verificar si el/los archivos seleccionados recientemente no están en selectedFiles =============');
          console.log(file[i].name);
          if(this.selectedFilesLabels.findIndex(x => x.fileName === file[i].name.toLowerCase()) != -1){
              //this.notifier.notify('error', 'Ya ha seleccionado el archivo: ' + file[i].name);
              return;
          }
      }

      console.log(this.allowedFiles);
      for (let /** @type {?} */ i = 0; i < file.length; i++) {
          console.log('==========================>');
          console.log(file[i].name.toLowerCase());
          console.log(this.allowedFiles.findIndex(x => x.NombreArchivo === file[i].name.toLowerCase()));
          if(this.allowedFiles.findIndex(x => x.NombreArchivo === file[i].name.toLowerCase()) != -1){
              this.allowedFiles[this.allowedFiles.findIndex(x => x.NombreArchivo === file[i].name.toLowerCase())].seleccionado = 'SI';                
              this.allowedFiles = [...this.allowedFiles];

              this.selectedFilesLabels.push({
                  fileName: file[i].name.toLowerCase(),
                  fileSize: this.convertSize(file[i].size),
                  errorMsg: ""
              });
              
              this.selectedFiles.push(file[i]); // verificar
          }
          else{
              this.selectedFilesLabels.push({
                  fileName: file[i].name.toLowerCase(),
                  fileSize: this.convertSize(file[i].size),
                  errorMsg: "El archivo no tiene un nombre válido."
              });
          }

          // Si se requiere verificar el tamaño de los archivos
          /*
          if (file[i].size > this.maxSize * 1024000) {
              this.notAllowedList.push({
                  fileName: file[i].name,
                  fileSize: this.convertSize(file[i].size),
                  errorMsg: "Tamaño del archivo inválido."
              });
          }
          /**/
      }
      console.log('HABLITAR BTN ENVIAR');
      console.log(this.selectedFiles.length !== 0);
      console.log(this.selectedFiles.length);
      console.log('VERIFICANDO');
      console.log(this.selectedFilesLabels.findIndex(x => x.errorMsg !== ""));

      if(this.selectedFilesLabels.findIndex(x => x.errorMsg !== "") !== -1)
      //if (this.selectedFiles.length > 0)
          this.uploadBtn = false;
      else
          this.uploadBtn = true;
      
      //this.notifier.hideAll();

      this.uploadMsg = false;
      this.uploadClick = true;
      this.percentComplete = 0;
      event.target.value = null;
  }
  /**
   * @return {?}
   */
  uploadFiles() {
      // verificamos que aun este en sesion
      //if(!this.authenticationService.isLoggedIn())
        //  location.reload(true);

      let /** @type {?} */ i;
      this.progressBarShow = true;
      this.uploadClick = false;
      let /** @type {?} */ isError = false;
      let /** @type {?} */ xhr = new XMLHttpRequest();
      let /** @type {?} */ formData = new FormData();

      for (i = 0; i < this.selectedFiles.length; i++) {
          //Add DATA TO BE SENT
          formData.append('files', this.selectedFiles[i]);
      }
      xhr.onreadystatechange = evnt => {
          if (xhr.readyState === 4) {
              if (xhr.status !== 200) {
                  isError = true;
                  this.progressBarShow = false;
                  this.uploadBtn = false;
                  this.uploadMsg = true;
                  this.afterUpload = true;
                  this.uploadMsgText = "Error en la carga del archivo";
                  this.uploadMsgClass = "text-danger lead";
              }
              this.ApiResponse.emit(xhr);
          }
      };
      xhr.upload.onprogress = evnt => {
          this.uploadBtn = false; // button should be disabled by process uploading
          if (evnt.lengthComputable) {
              this.percentComplete = Math.round((evnt.loaded / evnt.total) * 100);
          }
          //console.log("Progress..."+this.percentComplete+" %");
      };
      xhr.onload = evnt => {
          this.progressBarShow = false;
          this.uploadBtn = false;
          this.uploadMsg = true;
          this.afterUpload = true;
          if (!isError) {
              //this.uploadMsgText = "Se han enviado los archivos";
              this.uploadMsgText = "";
              this.uploadMsgClass = "text-success lead";
          }
          else{
              this.uploadMsgText = "Error en la carga del archivo";
              console.log('error linea 300');
          }
      };
      xhr.onerror = evnt => {
          console.log("onerror");
          console.log(evnt);
      };
      xhr.open("POST", this.uploadAPI, true);
      for (const key of Object.keys(this.headers)) {
          // Object.keys will give an Array of keys
          xhr.setRequestHeader(key, this.headers[key]);
      }
      //let token = sessionStorage.getItem("token");
      //xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      //xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
      console.log(formData);
  }

  /**
   * @param {?} i : indice 
   * @return {?}
   */
  removeFile(i) {
      let lIndex = this.allowedFiles.findIndex(x => x.NombreArchivo === this.selectedFilesLabels[i].fileName);

      // cambiar el estado en el grid de los archivos permitidos
      if(lIndex != -1){
          this.allowedFiles[lIndex].seleccionado = '';
          this.allowedFiles = [...this.allowedFiles];
      }

      // borrar de la lista de archivos (this.selectedFiles)
      if(this.selectedFiles.findIndex(x => x.name === this.selectedFilesLabels[i].fileName) !== -1)
          this.selectedFiles.splice(this.selectedFiles.findIndex(x => x.fileName === this.selectedFilesLabels[i].fileName), 1);

      // borrar de selectedFilesLabels
      this.selectedFilesLabels.splice(i, 1);    
      this.uploadBtn = this.selectedFiles.length > 0? true: false;
  }

  /**
   * @param {?} fileSize
   * @return {?}
   */
  convertSize(fileSize) {
      return fileSize < 1024000
          ? (fileSize / 1024).toFixed(2) + " KB"
          : (fileSize / 1024000).toFixed(2) + " MB";
  }
  /**
   * @return {?}
   */
  attachpinOnclick() {
      /** @type {?} */ ((
      //console.log("ID: ", this.id);
      document.getElementById("sel" + this.id))).click();
      //$("#"+"sel"+this.id).click();
  }
  /**
   * @param {?} event
   * @return {?}
   */
  drop(event) {
      event.stopPropagation();
      event.preventDefault();
      //console.log("drop: ", event);
      //console.log("drop: ", event.dataTransfer.files);
      this.onChange(event);
  }
  /**
   * @param {?} event
   * @return {?}
   */
  allowDrop(event) {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      //console.log("allowDrop: ",event)
  }
}
