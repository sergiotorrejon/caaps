import { Routes } from '@angular/router';
import { ArchivosComponent } from './archivos/archivos.component';
import { RegistroEnviosComponent } from './registro-envios/registro-envios.component';


export const MaterialRoutes: Routes = [

  {
    path: 'archivos',
    component: ArchivosComponent
  },
  {
    path: 'registro-envios',
    component: RegistroEnviosComponent
  },
  
];
