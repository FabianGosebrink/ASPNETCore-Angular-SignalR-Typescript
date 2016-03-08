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

var buildConfig = require('../gulp.config');
var common = require('./common.js');

gulp.task('build:web:prod', function (done) {
    runSeq(
        'web-clean-temp',
        'web-clean-dist',
        'web-copy-files-to-temp',
        'web-copy-fonts-to-prod',
        'web-concat-minify-css-and-copy-to-prod',
        'web-copy-files-as-is-to-js',
        'web-concat-minify-vendor-js-and-copy-to-prod',
        'web-copy-app-to-prod',
        'web-copy-system.config-to-prod',
        'web-inject-and-copy-index-to-prod',
        done);
});

gulp.task('build:web:dev', function (done) {
    runSeq(
        'web-copy-vendor-js-to-wwwroot',
        'web-inject-into-index',
        done);
});

gulp.task('web-clean-temp', function (done) {
    return del(buildConfig.temp.web, done);
});

gulp.task('web-clean-dist', function (done) {
    return del(buildConfig.dist.webFolder, done);
});

gulp.task('web-copy-files-to-temp', function (done) {

    return gulp.src([
        buildConfig.app.allJsFiles,
        buildConfig.app.allCssFiles,
        buildConfig.app.allHtmlFiles,
        buildConfig.app.indexHtmlFile,
        buildConfig.app.systemConfigJsFile
    ])
        .pipe(gulp.dest(buildConfig.temp.web));
});

gulp.task('web-copy-fonts-to-prod', function (done) {
    return gulp.src([
        buildConfig.allRootFontsFiles
    ]).pipe(gulp.dest(buildConfig.dist.webFontsFolder));
});

gulp.task('web-copy-vendor-js-to-wwwroot', function () {
    return common.copyVendorJsToWwwroot();
});

gulp.task('web-concat-minify-css-and-copy-to-prod', function (done) {

    var files = buildConfig.app.allRootVendorCssFiles;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.temp.webCss, file);
    });

    return gulp.src(allMappedSources)
        .pipe(concat(buildConfig.dist.cssMinFilename))
        .pipe(cssMinifier())
        .pipe(gulp.dest(buildConfig.dist.webFolder + "css"));
});

gulp.task('web-copy-files-as-is-to-js', function (done) {

    var files = [
        path.join(buildConfig.temp.webJs, buildConfig.sources.es6ShimJs),
        path.join(buildConfig.temp.web, buildConfig.sources.systemConfigJs)
    ];

    return gulp.src(files)
        .pipe(gulp.dest(buildConfig.dist.webFolder + "js"));
});

gulp.task('web-concat-minify-vendor-js-and-copy-to-prod', function (done) {

    var files = buildConfig.app.allRootVendorJsFiles;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.temp.webJs, file);
    });

    return gulp.src(allMappedSources)
        .pipe(concat(buildConfig.dist.jsMinFilename))
        .pipe(uglify())
        .pipe(gulp.dest(buildConfig.dist.webFolder + "js"));
});

gulp.task('web-copy-app-to-prod', function (done) {

    var appFiles = [
        buildConfig.temp.web +
        buildConfig.app.folder +
        "**/*"
    ];

    return gulp.src(appFiles)
        .pipe(gulp.dest(buildConfig.dist.webFolder + "app"));
});

gulp.task('web-copy-system.config-to-prod', function (done) {

    return gulp.src(path.join(
        buildConfig.temp.web, "system.config.js"
        ))
        .pipe(gulp.dest(buildConfig.dist.webFolder));
});

gulp.task('web-inject-and-copy-index-to-prod', function (done) {

    var target = gulp.src(buildConfig.temp.web + "index.html");

    var sources = gulp.src([
        path.join(buildConfig.dist.webFolder, "css", buildConfig.dist.cssMinFilename),
        path.join(buildConfig.dist.webFolder, "js", buildConfig.sources.es6ShimJs),
        path.join(buildConfig.dist.webFolder, "js", buildConfig.dist.jsMinFilename),
        path.join(buildConfig.dist.webFolder, buildConfig.sources.systemConfigJs)
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: ".dist/web/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.dist.webFolder));
});


gulp.task('web-inject-into-index', function (done) {

    var allJsFiles = buildConfig.app.allRootVendorJsFiles;

    var allMappedJsSources = allJsFiles.map(function (file) {
        return path.join(buildConfig.rootJsFolder, file);
    });

    allMappedJsSources.push(buildConfig.app.systemConfigJsFile);

    var allCssFiles = buildConfig.app.allRootVendorCssFiles;

    var allMappedCssSources = allCssFiles.map(function (file) {
        return path.join(buildConfig.rootCssFolder, file);
    });

    var allSources = [].concat(allMappedJsSources, allMappedCssSources);

    var target = gulp.src(buildConfig.app.indexHtmlFile);

    var sources = gulp.src(allSources, {
        read: false
    });

    return target.pipe(inject(sources, {
        ignorePath: "wwwroot/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.root));
});