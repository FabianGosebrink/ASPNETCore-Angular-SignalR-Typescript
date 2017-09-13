import { RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
var appRoutes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
export var routing = RouterModule.forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routes.js.map