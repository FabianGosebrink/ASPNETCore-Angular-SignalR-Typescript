import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './home/dashboard/dashboard.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', loadChildren: './about/about.module#AboutModule' }
];

export const appRouting = RouterModule.forRoot(appRoutes, { useHash: true });
