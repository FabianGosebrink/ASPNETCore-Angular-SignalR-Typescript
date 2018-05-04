import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  FoodDataService,
  MyFirstInterceptor
} from './services/food-data.service';
import { SignalRService } from './services/signalR.service';

@NgModule({
  imports: [HttpClientModule],
  exports: [],
  declarations: [],
  providers: []
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        FoodDataService,
        SignalRService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MyFirstInterceptor,
          multi: true
        }
      ]
    };
  }
}
