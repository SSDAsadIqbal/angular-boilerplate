// Angular modules
import { Routes } from '@angular/router';

export const routes : Routes = [
  {
    path         : 'auth',
    loadChildren : () => import('./authentication/auth/auth.routes').then(m => m.routes),
  },
  {
    path          : 'home',
    loadComponent : () => import('./authentication/home/home.component').then(m => m.HomeComponent),
  },
  { path : '', redirectTo : '/home', pathMatch : 'full' },
  {
    path          : '**',
    loadComponent : () => import('./authentication/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];