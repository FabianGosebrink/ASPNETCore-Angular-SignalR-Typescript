var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:electron', function (done) {
    runSeq(
        'electron-clean-temp',
        'electron-copy-vendor-js-to-wwwroot',
        'electron-copy-files-to-temp',
        'electron-copy-fonts-to-temp',
        'electron-build-win',
        done);
});

gulp.task('electron-clean-temp', function (done) {
    return del(buildConfig.temp.electron, done);
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
        buildConfig.app.indexHtmlFile
    ]).pipe(gulp.dest(buildConfig.temp.electron));
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

