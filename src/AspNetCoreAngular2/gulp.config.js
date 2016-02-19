'use strict';

module.exports = {
    config: {
        root: "./wwwroot/",
        rootJsFolder: "./wwwroot/js/",
        allRootVendorJsFiles: ['./wwwroot/js/*.js'],
        allRootFontsFiles: ["./wwwroot/fonts/*"],
        targetIndexHtmlFile: "./wwwroot/index.html",
        temp: {
            folder: "./.temp/",
            tempFolderElectron: "./.temp/electron/",
            tempFolderNwjs: "./.temp/nwjs/",
            fontsFolder: "./.temp/electron/fonts/",
            allElectronFiles: ["./.temp/electron/**/*"]
        },
        vendorJsFiles: [
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/angular2/bundles/angular2.dev.js",
            "bower_components/bootstrap/dist/js/bootstrap.js",
            "node_modules/es6-shim/es6-shim.min.js",
            "node_modules/angular2/bundles/http.dev.js",
            "bower_components/jquery/dist/jquery.js",
            "bower_components/signalr/jquery.signalr.js",
            "node_modules/angular2/bundles/router.dev.js",
            "node_modules/rxjs/bundles/Rx.js",
            "node_modules/systemjs/dist/system-polyfills.js",
            "node_modules/systemjs/dist/system.src.js",
        ]
    }
};