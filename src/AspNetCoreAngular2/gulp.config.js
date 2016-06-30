'use strict';

module.exports = {
    rootJsFolder: "./wwwroot/js/",
    allRootFontsFiles: "./wwwroot/fonts/*",

    app: {
        folder: "app/",
        indexHtmlFile: "./wwwroot/index.html",
        allJsFiles: "wwwroot/dist/*.bundle.js",
        allCssFiles: "wwwroot/css/*.css",
        allHtmlFiles: "wwwroot/**/*.html",
        allTsFiles: "../wwwroot/app/**/*.ts",
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
        electron: "./.temp/electron/",
        web: "./.temp/web/",
        cordova: "./.temp/cordova/",
    },
    assets: {
        electron: "assets/electron/*",
        cordova: "assets/cordova/",
    },
    dist: {
        electronFolder: "./.dist/electron/",
        webFolder: "./.dist/web/",
        appFolder: "./.dist/apps/",

        cssMinFilename: "vendor.min.css"
    },
    sources: {
        es6ShimJs: "es6-shim.min.js",
        signalR: "./bower_components/signalr/jquery.signalR.js",
    }
};