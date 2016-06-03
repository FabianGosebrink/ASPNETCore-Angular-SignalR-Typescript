var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var cssMinifier = require('gulp-minify-css');
var concat = require('gulp-concat');
var path = require('path');
var sh = require('shelljs');
var webpack = require('webpack-stream');
var inject = require('gulp-inject');

var buildConfig = require('../gulp.config');

gulp.task('build:apps', function (done) {
    runSeq(
        'cordova-clean-temp',
        'cordova-copy-config-to-temp',
        'cordova-webpack',
        'cordova-copy-css-files-to-temp',
        'cordova-copy-js-files-to-temp',
        'cordova-copy-index-file-to-temp',
        'cordova-copy-fonts-to-temp',
        'cordova-inject-files-in-index',
        'cordova-build-windows',
        // 'cordova-build-android',
        'cordova-copy-to-dist',
        done);
});

gulp.task('cordova-clean-temp', function (done) {
    return del(buildConfig.temp.cordova, done);
});

gulp.task('cordova-webpack', function (done) {
    return gulp.src(['../wwwroot/app/**/*.ts'])
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest(buildConfig.temp.cordova + "www/js/"));
});

gulp.task('cordova-copy-css-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.allCssFiles
    ]).pipe(concat(buildConfig.dist.cssMinFilename))
        .pipe(cssMinifier())
        .pipe(gulp.dest(buildConfig.temp.cordova + "www/css/"));
});

gulp.task('cordova-copy-js-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.sources.signalR
    ])
        .pipe(gulp.dest(buildConfig.temp.cordova + "www/js/"));
});

gulp.task('cordova-copy-fonts-to-temp', function (done) {
    return gulp.src([
        buildConfig.allRootFontsFiles
    ]).pipe(gulp.dest(buildConfig.temp.cordova + "www/fonts/"));
});

gulp.task('cordova-copy-index-file-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.indexHtmlFile
    ])
        .pipe(gulp.dest(buildConfig.temp.cordova + "www/"));
});

gulp.task('cordova-inject-files-in-index', function (done) {

    var target = gulp.src(buildConfig.temp.cordova + "www/index.html");

    var sources = gulp.src([
        path.join(buildConfig.temp.cordova, "www/css", buildConfig.dist.cssMinFilename),
        path.join(buildConfig.temp.cordova, "www/js", "vendor.bundle.js"),
        path.join(buildConfig.temp.cordova, "www/js", "jquery.signalR.js"),
        path.join(buildConfig.temp.cordova, "www/js", "app.bundle.js")
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: ".temp/cordova/www/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.temp.cordova + "www/"));
});

gulp.task('cordova-copy-config-to-temp', function () {
    var configFile = path.join(buildConfig.assets.cordova, "config.xml");

    return gulp.src([
        configFile
    ])
        .pipe(gulp.dest(buildConfig.temp.cordova));
});

gulp.task('cordova-build-windows', function (done) {
    sh.cd(buildConfig.temp.cordova);
    sh.exec('cordova platform add windows');
    sh.exec('cordova build windows');
    sh.cd('../..');
    done();
});

gulp.task('cordova-build-android', function (done) {
    sh.cd(buildConfig.temp.cordova);
    sh.exec('cordova platform add android');
    sh.exec('cordova build android');
    sh.cd('../..');
    done();
});

gulp.task('cordova-copy-to-dist', function () {
    var sourceFolder = path.join(buildConfig.temp.cordova, 'platforms', "**/*");
     return gulp.src([
        sourceFolder
    ])
        .pipe(gulp.dest(buildConfig.dist.appFolder));
});