import { Routes } from '@angular/router';
import { RecibeocComponent } from './pages/recibeoc/recibeoc.component';
import { ConsultaLlavesComponent } from './pages/consulta-llaves/consulta-llaves.component';

export const routes: Routes = [
  { path: '',              redirectTo: 'recibeoc', pathMatch: 'full' },
  { path: 'recibeoc',      component: RecibeocComponent },
  { path: 'llaves',        component: ConsultaLlavesComponent },
  { path: '**',            redirectTo: 'recibeoc' }
];
