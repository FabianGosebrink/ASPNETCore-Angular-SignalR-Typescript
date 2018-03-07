import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about.component';

const aboutRoutes: Routes = [{ path: '', component: AboutComponent }];

export const aboutRouting = RouterModule.forChild(aboutRoutes);
