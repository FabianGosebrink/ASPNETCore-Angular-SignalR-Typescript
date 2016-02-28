System.register(['angular2/platform/browser', 'angular2/core', 'angular2/router', 'angular2/http', './app.component', './app.constants', './services/signalRService'], function(exports_1) {
    var browser_1, core_1, router_1, http_1, app_component_1, app_constants_1, signalRService_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (app_constants_1_1) {
                app_constants_1 = app_constants_1_1;
            },
            function (signalRService_1_1) {
                signalRService_1 = signalRService_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [
                router_1.ROUTER_PROVIDERS,
                http_1.HTTP_PROVIDERS,
                app_constants_1.Configuration,
                signalRService_1.SignalRService,
                // provide(LocationStrategy, {useClass: HashLocationStrategy})
                core_1.bind(router_1.LocationStrategy).toClass(router_1.HashLocationStrategy),
                core_1.provide(router_1.APP_BASE_HREF, { useValue: '/' })
            ]);
        }
    }
});
//# sourceMappingURL=boot.js.map