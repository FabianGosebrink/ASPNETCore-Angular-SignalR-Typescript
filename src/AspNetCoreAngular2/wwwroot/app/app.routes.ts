import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });