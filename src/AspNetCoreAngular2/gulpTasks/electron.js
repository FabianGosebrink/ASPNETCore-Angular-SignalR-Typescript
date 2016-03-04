var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');

var buildConfig = require('../gulp.config');
require('./common.js');

gulp.task('build:electron', function (done) {
    runSeq(
        'electron-clean-temp',
        'common-copy-vendor-js-to-wwwroot',
        'electron-copy-files-to-temp',
        'electron-copy-fonts-to-temp',
        'electron-build-win',
        done);
});

gulp.task('electron-copy-fonts-to-temp', function (done) {
    return gulp.src([
        buildConfig.config.allRootFontsFiles
    ]).pipe(gulp.dest(buildConfig.config.temp.electronFonts));
});

gulp.task('electron-copy-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.config.assets.electron,
        buildConfig.config.app.allJsFiles,
        buildConfig.config.app.allCssFiles,
        buildConfig.config.app.allHtmlFiles,
        buildConfig.config.app.indexHtmlFile
    ]).pipe(gulp.dest(buildConfig.config.temp.electron));
});

gulp.task('electron-build-win', function (done) {
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

gulp.task('electron-clean-temp', function (done) {
    return del(buildConfig.config.temp.electron, done);
});