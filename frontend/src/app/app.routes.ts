import { Routes } from '@angular/router';
import { RecibeocComponent } from './pages/recibeoc/recibeoc.component';

export const routes: Routes = [
  { path: '', redirectTo: 'recibeoc', pathMatch: 'full' },
  { path: 'recibeoc', component: RecibeocComponent },
  // Aquí se agregarán más rutas en el futuro
  { path: '**', redirectTo: 'recibeoc' }
];
