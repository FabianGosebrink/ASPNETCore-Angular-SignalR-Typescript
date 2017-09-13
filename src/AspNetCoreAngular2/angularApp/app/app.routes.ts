import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
