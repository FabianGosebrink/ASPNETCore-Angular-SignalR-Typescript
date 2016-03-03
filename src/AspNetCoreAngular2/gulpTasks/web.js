var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');
var order = require("gulp-order");
var cssMinifier = require('gulp-minify-css');
var uglify = require('gulp-uglify');

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:web', function (done) {
    runSeq(
        'web-clean-temp',
        'web-clean-dist',
        'web-copy-files-to-temp',
        'web-copy-fonts-to-prod',
        'web-concat-minify-css-and-copy-to-prod',
        'web-copy-files-as-is-to-js',
        'web-concat-minify-vendor-js-and-copy-to-prod',
        'web-copy-app-to-prod',
        'web-copy-index-and-system-to-prod',
        done);
});

gulp.task('web-clean-temp', function (done) {
    return del(buildConfig.config.temp.web, done);
});

gulp.task('web-clean-dist', function (done) {
    return del(buildConfig.config.dist.webFolder, done);
});

gulp.task('web-copy-files-to-temp', function (done) {

    return gulp.src([
        buildConfig.config.app.allJsFiles,
        buildConfig.config.app.allCssFiles,
        buildConfig.config.app.allHtmlFiles,
        buildConfig.config.app.indexHtmlFile,
        buildConfig.config.app.systemConfigJsFile
    ])
        .pipe(gulp.dest(buildConfig.config.temp.web));
});

gulp.task('web-copy-fonts-to-prod', function (done) {
    return gulp.src(
        buildConfig.config.allRootFontsFiles
        ).pipe(gulp.dest(buildConfig.config.dist.webFontsFolder));
});

gulp.task('web-concat-minify-css-and-copy-to-prod', function (done) {

    var files = buildConfig.config.vendorCssFiles;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.config.temp.webCss, file);
    });

    return gulp.src(allMappedSources)
        .pipe(concat(buildConfig.config.dist.cssMinFilename))
        .pipe(cssMinifier())
        .pipe(gulp.dest(buildConfig.config.dist.webFolder + "css"));
});

gulp.task('web-copy-files-as-is-to-js', function (done) {

    var files = buildConfig.config.jsFilesToCopyAsIs;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.config.temp.webJs, file);
    });

    return gulp.src(allMappedSources)
        .pipe(gulp.dest(buildConfig.config.dist.webFolder + "js"));
});

gulp.task('web-concat-minify-vendor-js-and-copy-to-prod', function (done) {

    var files = buildConfig.config.vendorJsFilesForProd;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.config.temp.webJs, file);
    });

    return gulp.src(allMappedSources)
        .pipe(concat(buildConfig.config.dist.JsMinFilename))
        .pipe(uglify())
        .pipe(gulp.dest(buildConfig.config.dist.webFolder + "js"));
});

gulp.task('web-copy-app-to-prod', function (done) {

    var appFiles = [
        buildConfig.config.temp.web +
        buildConfig.config.app.folder +
        "**/*"
    ];

    return gulp.src(appFiles)
        .pipe(gulp.dest(buildConfig.config.dist.webFolder + "app"));
});

gulp.task('web-copy-index-and-system-to-prod', function (done) {

    var appFiles = [
        buildConfig.config.temp.web + "index.html",
        buildConfig.config.temp.web + "system.config.js"
    ];

    return gulp.src(appFiles)
        .pipe(gulp.dest(buildConfig.config.dist.webFolder));
});