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
var inject = require('gulp-inject');
var webpack = require('webpack-stream');

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:web:prod', function (done) {
    runSeq(
        'web-clean-temp',
        'web-clean-dist',
        'web-webpack',
        'web-copy-css-files-to-temp',
        'web-copy-js-files-to-temp',
        'web-copy-index-file-to-temp',
        'web-copy-fonts-to-temp',
        'web-inject-files-in-index',
        'web-copy-other-files-to-prod',
        done);
});

gulp.task('web-webpack', function (done) {
    return gulp.src(['../wwwroot/app/**/*.ts'])
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest(buildConfig.temp.web + "js"));
});

gulp.task('web-clean-temp', function (done) {
    return del(buildConfig.temp.web, done);
});

gulp.task('web-clean-dist', function (done) {
    return del(buildConfig.dist.webFolder, done);
});

gulp.task('web-copy-css-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.allCssFiles
    ]).pipe(concat(buildConfig.dist.cssMinFilename))
        .pipe(cssMinifier())
        .pipe(gulp.dest(buildConfig.temp.web + "css/"));
});

gulp.task('web-copy-js-files-to-temp', function (done) {
    return gulp.src([
        buildConfig.sources.signalR
    ])
        .pipe(gulp.dest(buildConfig.temp.web + "js/"));
});

gulp.task('web-copy-fonts-to-temp', function (done) {
    return gulp.src([
        buildConfig.allRootFontsFiles
    ]).pipe(gulp.dest(buildConfig.temp.web + "fonts/"));
});

gulp.task('web-copy-index-file-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.indexHtmlFile
    ])
        .pipe(gulp.dest(buildConfig.temp.web));
});

gulp.task('web-copy-index-file-to-temp', function (done) {
    return gulp.src([
        buildConfig.app.indexHtmlFile
    ])
        .pipe(gulp.dest(buildConfig.temp.web));
});

gulp.task('web-copy-other-files-to-prod', function (done) {
    return gulp.src([
        buildConfig.temp.web + "**/*.*"
    ]).pipe(gulp.dest(buildConfig.dist.webFolder));
});

gulp.task('web-inject-files-in-index', function (done) {

    var target = gulp.src(buildConfig.temp.web + "index.html");

    var sources = gulp.src([
        path.join(buildConfig.temp.web, "css", buildConfig.dist.cssMinFilename),
        path.join(buildConfig.temp.web, "js", "vendor.bundle.js"),
        path.join(buildConfig.temp.web, "js", "jquery.signalR.js"),
        path.join(buildConfig.temp.web, "js", "app.bundle.js")
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: ".temp/web/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.temp.web));
});