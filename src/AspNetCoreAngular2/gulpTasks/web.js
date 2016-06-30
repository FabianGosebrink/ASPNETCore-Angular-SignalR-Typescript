var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');
var cssMinifier = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var webpack = require('webpack-stream');

var buildConfig = require('../gulp.config');

gulp.task('build:web:prod', function (done) {
    runSeq(
        'web-clean-temp',
        'web-clean-dist',
        'web-webpack-prod',
        'web-copy-css-files-to-temp',
        'web-copy-js-files-to-temp',
        'web-copy-index-file-to-temp',
        'web-copy-fonts-to-temp',
        'web-inject-files-in-index',
        'web-copy-all-files-to-prod',
        done);
});

gulp.task('build:web:dev', function (done) {
    runSeq(
        'web-dev-clean-js',
        'web-dev-webpack',
        'web-dev-copy-signalR',
        'web-dev-inject-files-in-index',
        done);
});

gulp.task('web-dev-clean-js', function (done) {
    return del(buildConfig.rootJsFolder, done);
});

gulp.task('web-dev-webpack', function (done) {
    return gulp.src([buildConfig.app.allTsFiles])
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest(buildConfig.rootJsFolder));
});

gulp.task('web-dev-copy-signalR', function (done) {
    return gulp.src([buildConfig.sources.signalR])
        .pipe(gulp.dest(buildConfig.rootJsFolder));
});


gulp.task('web-dev-inject-files-in-index', function (done) {

    var target = gulp.src("./wwwroot/index.html");

    var sources = gulp.src([
        path.join("./wwwroot/css", "*.css"),
        path.join("./wwwroot/js", "vendor.bundle.js"),
        path.join("./wwwroot/js", "jquery.signalR.js"),
        path.join("./wwwroot/js", "app.bundle.js")
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: "wwwroot/",
        addRootSlash: false
    })).pipe(gulp.dest("./wwwroot"));
});


gulp.task('web-webpack-prod', function (done) {
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


gulp.task('web-copy-all-files-to-prod', function (done) {
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