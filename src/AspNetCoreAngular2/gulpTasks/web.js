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

gulp.task('web:build:prod', function (done) {
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

gulp.task('web:build:dev', function (done) {
    runSeq(
        'common-copy-vendor-js-to-wwwroot',
        'web-inject-into-index',
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

    var files = buildConfig.config.app.allRootVendorCssFiles;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.config.temp.webCss, file);
    });

    return gulp.src(allMappedSources)
        .pipe(concat(buildConfig.config.dist.cssMinFilename))
        .pipe(cssMinifier())
        .pipe(gulp.dest(buildConfig.config.dist.webFolder + "css"));
});

gulp.task('web-copy-files-as-is-to-js', function (done) {

    var files = [
        path.join(buildConfig.config.temp.webJs, buildConfig.config.sources.es6ShimJs),
        path.join(buildConfig.config.temp.web, buildConfig.config.sources.systemConfigJs)
    ];

    return gulp.src(files)
        .pipe(gulp.dest(buildConfig.config.dist.webFolder + "js"));
});

gulp.task('web-concat-minify-vendor-js-and-copy-to-prod', function (done) {

    var files = buildConfig.config.app.allRootVendorJsFiles;

    var allMappedSources = files.map(function (file) {
        return path.join(buildConfig.config.temp.webJs, file);
    });

    return gulp.src(allMappedSources)
        .pipe(concat(buildConfig.config.dist.jsMinFilename))
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

gulp.task('web-copy-system.config-to-prod', function (done) {

    return gulp.src(path.join(
        buildConfig.config.temp.web, "system.config.js"
        ))
        .pipe(gulp.dest(buildConfig.config.dist.webFolder));
});

gulp.task('web-inject-and-copy-index-to-prod', function (done) {

    var target = gulp.src(buildConfig.config.temp.web + "index.html");

    var sources = gulp.src([
        path.join(buildConfig.config.dist.webFolder, "css", buildConfig.config.dist.cssMinFilename),
        path.join(buildConfig.config.dist.webFolder, "js", buildConfig.config.sources.es6ShimJs),
        path.join(buildConfig.config.dist.webFolder, "js", buildConfig.config.dist.jsMinFilename),
        path.join(buildConfig.config.dist.webFolder, buildConfig.config.sources.systemConfigJs)
    ], {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: ".dist/web/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.config.dist.webFolder));
});


gulp.task('web-inject-into-index', function (done) {

    var allJsFiles = buildConfig.config.app.allRootVendorJsFiles;

    var allMappedJsSources = allJsFiles.map(function (file) {
        return path.join(buildConfig.config.rootJsFolder, file);
    });
    
    allMappedJsSources.push(buildConfig.config.app.systemConfigJsFile);
    
    var allCssFiles = buildConfig.config.app.allRootVendorCssFiles;

    var allMappedCssSources = allCssFiles.map(function (file) {
        return path.join(buildConfig.config.rootCssFolder, file);
    });
    
    var allSources = [].concat(allMappedJsSources, allMappedCssSources);
    
    var target = gulp.src(buildConfig.config.app.indexHtmlFile);

    var sources = gulp.src(allSources, {
            read: false
        });

    return target.pipe(inject(sources, {
        ignorePath: "wwwroot/",
        addRootSlash: false
    })).pipe(gulp.dest(buildConfig.config.root));
});