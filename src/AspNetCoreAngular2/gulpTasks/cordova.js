var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');
var sh = require('shelljs');

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:apps', function(done) {
    runSeq(
        'cordova-clean-temp',
        'cordova-copy-config-to-temp',
        'cordova-copy-vendor-js-to-wwwroot',
        'cordova-copy-files-to-temp-www',
        'cordova-copy-fonts-to-temp-www',
        'cordova-build-windows',
        'cordova-build-android',
        'cordova-copy-to-dist',
        done);
});

gulp.task('cordova-clean-temp', function(done) {
    return del(buildConfig.temp.cordova, done);
});

gulp.task('cordova-copy-vendor-js-to-wwwroot', function() {
    return common.copyVendorJsToWwwroot();
});

gulp.task('cordova-copy-config-to-temp', function() {
    var configFIle = path.join(buildConfig.assets.cordova, "config.xml");

    return gulp.src([
        configFIle
    ])
        .pipe(gulp.dest(buildConfig.temp.cordova));
});

gulp.task('cordova-copy-files-to-temp-www', function(done) {
    var targetPath = path.join(buildConfig.temp.cordova, "www");

    return gulp.src([
        buildConfig.app.allJsFiles,
        buildConfig.app.allCssFiles,
        buildConfig.app.allHtmlFiles,
        buildConfig.app.indexHtmlFile,
        buildConfig.app.systemConfigJsFile
    ])
        .pipe(gulp.dest(targetPath));
});

gulp.task('cordova-copy-fonts-to-temp-www', function(done) {
    var targetPath = path.join(buildConfig.temp.cordova, "www", "fonts");

    return gulp.src([
        buildConfig.allRootFontsFiles
    ]).pipe(gulp.dest(targetPath));
});

gulp.task('cordova-build-windows', function(done) {
    sh.cd(buildConfig.temp.cordova);
    sh.exec('cordova platform add windows');
    sh.exec('cordova build windows');
    sh.cd('../..');
    done();
});

gulp.task('cordova-build-android', function(done) {
    sh.cd(buildConfig.temp.cordova);
    sh.exec('cordova platform add android');
    sh.exec('cordova build android');
    sh.cd('../..');
    done();
});

gulp.task('cordova-copy-to-dist', function() {
    var sourceFolder = path.join(buildConfig.temp.cordova, 'platforms', "**/*");
    return common.copyToDist(sourceFolder);
});