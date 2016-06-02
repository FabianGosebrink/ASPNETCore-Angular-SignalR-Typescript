var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');
var webpack = require('webpack-stream');

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:electron', function (done) {
    runSeq(
        'electron-clean-temp',
        'electron-webpack',
        'electron-copy-vendor-js-to-wwwroot',
        //'electron-copy-files-to-temp',
        //'electron-copy-fonts-to-temp',
        //'electron-build-win',
        done);
});

gulp.task('electron-clean-temp', function (done) {
    return del(buildConfig.temp.electron, done);
});

gulp.task('electron-webpack', function (done) {
    return gulp.src(['../wwwroot/app/**/*.ts'])
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest('./wwwroot/dist/'));
});

gulp.task('electron-copy-vendor-js-to-wwwroot', function () {
    return common.copyVendorJsToWwwroot();
});

gulp.task('electron-copy-fonts-to-temp', function (done) {
    return gulp.src([
        buildConfig.allRootFontsFiles
    ]).pipe(gulp.dest(buildConfig.temp.electronFonts));
});

gulp.task('electron-copy-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.assets.electron,
        buildConfig.app.allJsFiles,
        buildConfig.app.allCssFiles,
        buildConfig.app.allHtmlFiles,
        buildConfig.sources.signalR,
        buildConfig.app.indexHtmlFile
    ]).pipe(gulp.dest(buildConfig.temp.electron));
});

gulp.task('electron-inject', function (done) {

    var target = gulp.src(buildConfig.temp.electron + "index.html");

    var sources = gulp.src([
        path.join(buildConfig.temp.electron, "css/*.css"),
        path.join(buildConfig.temp.electron, "vendor.bundle.js"),
        path.join(buildConfig.temp.electron, "js", buildConfig.sources.signalR),
        path.join(buildConfig.temp.electron, "js/app.bundle.js")
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: ".dist/web/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.dist.webFolder));
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

