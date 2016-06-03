'use strict';

module.exports = {
    root: "./wwwroot/",
    rootJsFolder: "./wwwroot/js/",
    rootCssFolder: "./wwwroot/css/",

    allRootFontsFiles: "./wwwroot/fonts/*",

    app: {
        folder: "app/",
        indexHtmlFile: "./wwwroot/index.html",
        allJsFiles: "wwwroot/dist/*.bundle.js",
        allCssFiles: "wwwroot/css/*.css",
        allHtmlFiles: "wwwroot/**/*.html",
        systemConfigJsFile: "wwwroot/system.config.js",
        allRootVendorJsFiles: [
            "jquery.SignalR.js",
        ],
        allRootVendorCssFiles: [
            "bootstrap.css",
            "metisMenu.min.css",
            "timeline.css",
            "sb-admin-2.css",
            "morris.css",
            "font-awesome.min.css"
        ],
    },
    temp: {
        folder: "./.temp/",

        electron: "./.temp/electron/",
        electronFonts: "./.temp/electron/fonts/",

        web: "./.temp/web/",
        webFonts: "./.temp/web/fonts/",
        webCss: "./.temp/web/css/",
        webJs: "./.temp/web/js/",

        cordova: "./.temp/cordova/",
    },
    assets: {
        electron: "assets/electron/*",
        cordova: "assets/cordova/",
    },
    dist: {
        folder: "./.dist/",

        electronFolder: "./.dist/electron/",

        webFolder: "./.dist/web/",
        webFontsFolder: "./.dist/web/fonts",

        appFolder: "./.dist/app",

        cssMinFilename: "vendor.min.css",
        jsMinFilename: "vendor.min.js"
    },
    sources: {
        es6ShimJs: "es6-shim.min.js",
        systemConfigJs: "system.config.js",
        signalR: "./wwwroot/js/jquery.signalR.js",
        jsFilesInclSourcePaths: [
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/angular2/bundles/angular2.dev.js",
            "node_modules/bootstrap/dist/js/bootstrap.js",
            "node_modules/es6-shim/es6-shim.min.js",
            "node_modules/angular2/bundles/http.dev.js",
            "node_modules/jquery/dist/jquery.js",
            "bower_components/signalr/jquery.signalR.js",
            "node_modules/angular2/bundles/router.dev.js",
            "node_modules/angular2/es6/dev/src/testing/shims_for_IE.js",
            "node_modules/rxjs/bundles/Rx.js",
            "node_modules/systemjs/dist/system-polyfills.js",
            "node_modules/systemjs/dist/system.src.js",
        ]
    }
};