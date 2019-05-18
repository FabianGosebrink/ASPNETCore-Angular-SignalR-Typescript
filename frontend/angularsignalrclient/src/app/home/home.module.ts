import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { allContainerComponents } from './container';
import { homeRoutes } from './home.routing';
import { allPresentationalComponents } from './presentational';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [...allPresentationalComponents, ...allContainerComponents],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(homeRoutes),
    NgxChartsModule
  ]
})
export class HomeModule {}
