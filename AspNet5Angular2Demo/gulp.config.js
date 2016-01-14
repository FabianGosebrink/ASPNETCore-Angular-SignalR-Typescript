'use strict';

module.exports = {
    general: {
        appName: 'AspNet5Angular2Demo',
        appRoot: 'wwwroot/app/'
    },
    source: {
        baseFolder: '.',
        folder: './wwwroot',
        index: './wwwroot/index.html',
        packageJson: 'package.json',
        files: {
            app: {
                js: [
                    'app/*.js',
                    'app/*/*.component.js',
                    'app/*/*.js'
                ],
                html: [
                    'app/**/*.html'
                ],
                css: [
                    'css/custom.css'
                ]
            },
            vendor: {
                js: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'node_modules/angular2/bundles/angular2-polyfills.js',
                    'node_modules/systemjs/dist/system.src.js',
                    'node_modules/typescript/lib/typescript.js',
                    'node_modules/rxjs/bundles/Rx.js',
                    'node_modules/angular2/bundles/angular2.dev.js',
                    'node_modules/angular2/bundles/router.dev.js',
                    'node_modules/angular2/bundles/router.dev.js',
                    'node_modules/angular2/bundles/http.dev.js'
                ],
                css: [
                    'bower_components/bootstrap/dist/css/bootstrap.css'
                ],
                fonts: [
                ]
            }
        }
    },
    targets: {
        wwwrootFolder: 'wwwroot/',
        cssFolder: 'wwwroot/css/',
        wwwrootJsFolder: 'wwwroot/js/',
        tempFolder: '.temp/',
        devFolder: 'dev/',
        prodFolder: 'prod/',
        distFolder: '.dist/',
        webFolder: 'Web',
        appFolder: 'App',
        buildFolder: '.build/',
        minified: {
            appJs: 'app.js',
            vendorJs: 'vendor.js',
            appCss: 'app.css',
            vendorCss: 'vendor.css'
        }
    }
};
