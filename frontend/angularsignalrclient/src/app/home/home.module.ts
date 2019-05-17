import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { allContainerComponents } from './container';
import { homeRoutes } from './home.routing';
import { allPresentationalComponents } from './presentational';

@NgModule({
  declarations: [...allPresentationalComponents, ...allContainerComponents],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(homeRoutes)
  ]
})
export class HomeModule {}
