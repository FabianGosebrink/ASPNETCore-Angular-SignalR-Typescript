'use strict';

module.exports = {
    config: {
        root: "./wwwroot/",
        rootJsFolder: "./wwwroot/js/",
        allRootVendorJsFiles: ['./wwwroot/js/*.js'],
        allRootFontsFiles: ["./wwwroot/fonts/*"],
        es6ShimJs: "es6-shim.min.js",
        app: {
            folder: "app/",
            indexHtmlFile: "./wwwroot/index.html",
            allJsFiles: "wwwroot/**/*.js",
            allCssFiles: "wwwroot/**/*.css",
            allHtmlFiles: "wwwroot/**/*.html",
            systemConfigJsFile: "wwwroot/system.config.js"
        },
        temp: {
            folder: "./.temp/",

            electron: "./.temp/electron/",
            electronFonts: "./.temp/electron/fonts/",
            allElectronFiles: ["./.temp/electron/**/*"],

            web: "./.temp/web/",
            webFonts: "./.temp/web/fonts/",
            webCss: "./.temp/web/css/",
            webJs: "./.temp/web/js/",
        },
        assets: {
            electron: "assets/electron/*",
        },
        dist: {
            folder: "./.dist/",
            electronFolder: "./.dist/electron/",

            webFolder: "./.dist/web/",
            webFontsFolder: "./.dist/web/fonts",
            cssMinFilename: "vendor.min.css",
            JsMinFilename: "vendor.min.js"
        },
        vendorJsFilesForDev: [
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
        ],
        vendorJsFilesForProd: [
            "system-polyfills.js",
            "shims_for_IE.js",
            "angular2-polyfills.js",
            "system.src.js",
            "Rx.js",
            "angular2.dev.js",
            "http.dev.js",
            "router.dev.js",
            "jquery.js",
            "jquery.signalR.js",
            "bootstrap.js",
        ],
        jsFilesToCopyAsIs: [
            "es6-shim.min.js"
        ],
        vendorCssFiles: [
            "bootstrap.css",
            "metisMenu.min.css",
            "timeline.css",
            "sb-admin-2.css",
            "morris.css",
            "font-awesome.min.css"
        ]
    }
};