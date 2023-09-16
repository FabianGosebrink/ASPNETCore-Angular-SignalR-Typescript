import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'about',
    loadChildren: () => import('./about').then((m) => m.ABOUT_ROUTES),
  },
];
