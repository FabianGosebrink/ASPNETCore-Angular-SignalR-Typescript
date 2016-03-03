var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var NwBuilder = require('nw-builder');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');

gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

var buildConfig = require('./gulp.config');

gulp.task('electron:windows', function (done) {
    runSeq(
        'clean-temp-electron',
        'copy-vendor-js-to-wwwroot',
        'copy-electron-files',
        'copy-fonts-to-electron-temp',
        'build-electron',
        done);
});

gulp.task('copy:vendor:js:to:wwwroot', function (done) {
    runSeq(
        'clean-vendor-js-in-root',
        'copy-vendor-js-to-wwwroot',
        done);
});

gulp.task('copy-vendor-js-to-wwwroot', function () {
    return gulp.src(buildConfig.config.vendorJsFiles)
        .pipe(gulp.dest(buildConfig.config.rootJsFolder))
});

gulp.task('copy-fonts-to-electron-temp', function (done) {
    return gulp.src(
        buildConfig.config.allRootFontsFiles
        ).pipe(gulp.dest(buildConfig.config.temp.electronFonts));
});

gulp.task('copy-electron-files', function (done) {
    return gulp.src([
        buildConfig.config.assets.electron,
        buildConfig.config.app.allJsFiles,
        buildConfig.config.app.allCssFiles,
        buildConfig.config.app.allHtmlFiles,
        buildConfig.config.app.indexHtmlFile
    ]).pipe(gulp.dest(buildConfig.config.temp.electron));
});

gulp.task('build-electron', function (done) {
    return gulp.src(path.join(buildConfig.config.temp.electron, '**', '*'))
        .pipe(electron({
            version: '0.36.9',
            platform: 'win32',
            arch: 'x64',
            companyName: 'Offering Solutions',
            linuxExecutableName: 'ASPNETCoreAngularJS2Example',
        }))
        .pipe(symdest(buildConfig.config.dist.electronFolder + 'win'));
});

gulp.task('clean-vendor-js-in-root', function (done) {
    return del(buildConfig.config.temp.allRootVendorJsFiles, done);
});

gulp.task('clean-temp-electron', function (done) {
    return del(buildConfig.config.temp.electron, done);
});

gulp.task('clean-app-js-and-jsmap', function (done) {
    return del([
        "./wwwroot/**/*.js",
        "./wwwroot/**/*.js.map",
        "!./wwwroot/js/*.js"
    ], done);
});