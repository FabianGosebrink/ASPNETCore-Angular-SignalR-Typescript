import { NgModule } from '@angular/core';

import { AboutComponent } from './about.component';
import { aboutRouting } from './about.routing';

@NgModule({
  imports: [aboutRouting],
  exports: [],
  declarations: [AboutComponent],
  providers: []
})
export class AboutModule {}
