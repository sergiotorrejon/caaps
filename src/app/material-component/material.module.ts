import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../app-material-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialRoutes } from './material.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArchivosComponent } from './archivos/archivos.component';
import { RegistroEnviosComponent } from './registro-envios/registro-envios.component';
import { AngularFileUploaderComponent } from './angular-file-uploader/angular-file-uploader.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ErroresFormatoModalComponent } from './errores-formato-modal/errores-formato-modal.component';
import { ValidacionModalComponent } from './validacion-modal/validacion-modal.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  entryComponents: [/*DialogOverviewExampleDialogComponent,*/MessageBoxComponent,ErroresFormatoModalComponent,ValidacionModalComponent],
  declarations: [

    ArchivosComponent,
    
    RegistroEnviosComponent,
    
    AngularFileUploaderComponent,
    
    MessageBoxComponent,
    
    ErroresFormatoModalComponent,
    
    ValidacionModalComponent,
    
  ]
  //bootstrap: [AppComponent]
})
export class MaterialComponentsModule {}
