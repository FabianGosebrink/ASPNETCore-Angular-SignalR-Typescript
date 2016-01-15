var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var inject = require('gulp-inject');
var replace = require('gulp-replace-path');
var order = require("gulp-order");

var buildConfig = require('./gulp.config');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('dev-ms-visualStudio', function (done) {
    runSequence(
        'dev-copy-vendor-js-to-wwwrootlib',
        'dev-copy-vendor-css-to-wwwrootlib',
        'dev-inject-vendor-to-index',
        'dev-copy-custom-css-to-wwwrootlib',
        'dev-copy-html-to-wwwroot',
        done);
});

gulp.task('dev-copy-vendor-js-to-wwwrootlib', function (done) {
    var sources = gulp.src(getMappedSourceFiles(buildConfig.source.files.vendor.js, buildConfig.source.baseFolder));
    return sources.pipe(gulp.dest(buildConfig.targets.wwwrootJsFolder));
});

gulp.task('dev-copy-vendor-css-to-wwwrootlib', function (done) {
    var sources = gulp.src(getMappedSourceFiles(buildConfig.source.files.vendor.css, buildConfig.source.baseFolder));
    return sources.pipe(gulp.dest(buildConfig.targets.wwwrootCssFolder));
});

gulp.task('dev-copy-custom-css-to-wwwrootlib', function (done) {
    var sources = gulp.src(buildConfig.source.files.app.css);
    return sources.pipe(gulp.dest(buildConfig.targets.wwwrootAppFolder));
});

gulp.task('dev-inject-vendor-to-index', function (done) {

    var target = gulp.src(buildConfig.source.index);

    var sources = gulp.src([
        //buildConfig.targets.wwwrootJsFolder + '*.js',
        buildConfig.targets.wwwrootCssFolder + '*.css'], { read: false });

    return target.pipe(inject(sources, {
        addRootSlash: false,
        ignorePath: buildConfig.targets.wwwrootFolder
    })).pipe(gulp.dest(buildConfig.targets.wwwrootFolder));
});

gulp.task('dev-copy-html-to-wwwroot', function (done) {
    return gulp
        .src(['app/**/*.html'])
        .pipe(gulp.dest(buildConfig.targets.wwwrootAppFolder));
});

function getMappedSourceFiles(files, baseFolder) {
    return files.map(function (file) {
        return path.join(baseFolder, file);
    });
}