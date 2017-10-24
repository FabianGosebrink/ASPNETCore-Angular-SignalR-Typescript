import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FoodDataService } from './services/food-data.service';
import { SignalRService } from './services/signalR.service';

@NgModule({
    imports: [HttpModule],
    exports: [],
    declarations: [],
    providers: [],
})

export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                FoodDataService,
                SignalRService
            ]
        };
    }
}
