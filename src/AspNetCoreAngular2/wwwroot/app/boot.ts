import { bootstrap } from 'angular2/platform/browser';
import { provide, bind } from 'angular2/core';
import { APP_BASE_HREF, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AppComponent } from './app.component';
import { SignalRService } from './services/signalRService';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    SignalRService,
    // provide(LocationStrategy, {useClass: HashLocationStrategy})
    bind(LocationStrategy).toClass(HashLocationStrategy),
    provide(APP_BASE_HREF, {useValue: '/'})
]);
