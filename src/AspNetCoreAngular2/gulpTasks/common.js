var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');

var buildConfig = require('../gulp.config');

gulp.task('common-copy-vendor-js-to-wwwroot', function (done) {
    runSeq(
        'common-clean-vendor-js-in-root',
        'common-copy-vendor-js-to-wwwroot-internal',
        done);
});

gulp.task('common-clean-app-js-and-jsmap', function (done) {
    return del([
        "./wwwroot/**/*.js",
        "./wwwroot/**/*.js.map",
        "!./wwwroot/js/*.js"
    ], done);
});

gulp.task('common-copy-vendor-js-to-wwwroot-internal', function () {
    return gulp.src(buildConfig.config.sources.jsFilesInclSourcePaths)
        .pipe(gulp.dest(buildConfig.config.rootJsFolder))
});

gulp.task('common-clean-vendor-js-in-root', function (done) {
    return del(buildConfig.config.temp.allRootVendorJsFiles, done);
});

function getMappedSourceFiles(files, baseFolder) {
    return files.map(function (file) {
        return path.join(baseFolder, file);
    });
}