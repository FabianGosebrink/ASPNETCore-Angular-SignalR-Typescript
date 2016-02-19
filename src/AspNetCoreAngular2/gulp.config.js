'use strict';

module.exports = {
    config: {
        root: "./wwwroot/",
        rootJsFolder: "./wwwroot/js/",
        allRootVendorJsFiles: ['./wwwroot/js/*.js'],
        allRootFontsFiles: ["./wwwroot/fonts/*"],
        app:{
            indexHtmlFile: "./wwwroot/index.html",
            allJsFiles:"wwwroot/**/*.js",
            allCssFiles:"wwwroot/**/*.css",
            allHtmlFiles:"wwwroot/**/*.html",
        },
        temp: {
            folder: "./.temp/",
            
            electron: "./.temp/electron/",
            electronFonts: "./.temp/electron/fonts/",
            allElectronFiles: ["./.temp/electron/**/*"],
            
            nwjs: "./.temp/nwjs/",
            nwjsFonts: "./.temp/nwjs/fonts/",
            allNwjsFiles: ["./.temp/nwjs/**/*"],
        },
        assets: {
            nwjs: "assets/nwjs/*",
            electron: "assets/electron/*",
        },
        dist: {
            folder: "./.dist/",
            nwjsFolder: "./.dist/nwjs/",
            electronFolder: "./.dist/electron/",
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