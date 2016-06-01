import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide, bind } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
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
