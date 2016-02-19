import {bootstrap} from 'angular2/platform/browser';
import {Component, provide} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component';
import { Configuration } from './app.constants';
import { SignalRService } from './services/signalRService';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    Configuration,
    SignalRService,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
