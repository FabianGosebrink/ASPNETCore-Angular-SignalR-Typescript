import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './container/about/about.component';
import { RouterModule } from '@angular/router';
import { aboutRoutes } from './about.routing';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, RouterModule.forChild(aboutRoutes)]
})
export class AboutModule {}
