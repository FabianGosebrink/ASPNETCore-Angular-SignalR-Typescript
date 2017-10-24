import { aboutRouting } from './about.routing';
import { NgModule } from '@angular/core';

import { AboutComponent } from './about.component';

@NgModule({
    imports: [
        aboutRouting
    ],
    exports: [],
    declarations: [AboutComponent],
    providers: [],
})
export class AboutModule { }
