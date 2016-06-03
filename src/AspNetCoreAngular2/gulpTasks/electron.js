var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');
var webpack = require('webpack-stream');
var cssMinifier = require('gulp-minify-css');
var inject = require('gulp-inject');

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:electron', function (done) {
    runSeq(
        'electron-clean-temp',
        'electron-clean-dist',
        'electron-webpack',
        'electron-copy-css-files-to-temp',
        'electron-copy-js-files-to-temp',
        'electron-copy-index-file-to-temp',
        'electron-copy-fonts-to-temp',
        'electron-copy-assets-to-temp',
        'electron-inject-files-in-index',
        'electron-build-win',
        done);
});

gulp.task('electron-clean-temp', function (done) {
    return del(buildConfig.temp.electron, done);
});

gulp.task('electron-clean-dist', function (done) {
    return del(buildConfig.dist.electron, done);
});

gulp.task('electron-webpack', function (done) {
    return gulp.src(['../wwwroot/app/**/*.ts'])
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest(buildConfig.temp.electron + "js"));
});

gulp.task('electron-copy-css-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.allCssFiles
    ]).pipe(concat(buildConfig.dist.cssMinFilename))
        .pipe(cssMinifier())
        .pipe(gulp.dest(buildConfig.temp.electron + "css/"));
});

gulp.task('electron-copy-js-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.sources.signalR
    ])
        .pipe(gulp.dest(buildConfig.temp.electron + "js/"));
});

gulp.task('electron-copy-index-file-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.indexHtmlFile
    ])
        .pipe(gulp.dest(buildConfig.temp.electron));
});

gulp.task('electron-copy-assets-to-temp', function (done) {
    return gulp.src([
        buildConfig.assets.electron
    ])
        .pipe(gulp.dest(buildConfig.temp.electron));
});

gulp.task('electron-copy-fonts-to-temp', function (done) {
    return gulp.src([
        buildConfig.allRootFontsFiles
    ]).pipe(gulp.dest(buildConfig.temp.electron + "fonts/"));
});

gulp.task('electron-inject-files-in-index', function (done) {

    var target = gulp.src(buildConfig.temp.electron + "index.html");

    var sources = gulp.src([
        path.join(buildConfig.temp.electron, "css", buildConfig.dist.cssMinFilename),
        path.join(buildConfig.temp.electron, "js", "vendor.bundle.js"),
        path.join(buildConfig.temp.electron, "js", "jquery.signalR.js"),
        path.join(buildConfig.temp.electron, "js", "app.bundle.js")
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: ".temp/electron/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.temp.electron));
});

gulp.task('electron-build-win', function (done) {
    return gulp.src(path.join(buildConfig.temp.electron, '**', '*'))
        .pipe(electron({
            version: '0.36.9',
            platform: 'win32',
            arch: 'x64',
            companyName: 'Offering Solutions',
            linuxExecutableName: 'ASPNETCoreAngularJS2Example',
        }))
        .pipe(symdest(buildConfig.dist.electronFolder + 'win'));
});

