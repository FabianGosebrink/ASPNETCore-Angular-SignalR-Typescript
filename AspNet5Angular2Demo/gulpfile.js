var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var inject = require('gulp-inject');
var replace = require('gulp-replace-path');

var buildConfig = require('./gulp.config');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('dev-ms-visualStudio', function (done) {
    runSequence(
        'dev-copy-vendor-js-to-wwwrootlib',
        'dev-inject-vendor-js-to-index',
        done);
});

gulp.task('dev-copy-vendor-js-to-wwwrootlib', function (done) {
    var sources = gulp.src(getMappedSourceFiles(buildConfig.source.files.vendor.js, buildConfig.source.baseFolder));
    return sources.pipe(gulp.dest(buildConfig.targets.wwwrootJsFolder));
});

gulp.task('dev-inject-vendor-js-to-index', function (done) {

    var target = gulp.src(buildConfig.source.index);
    var sources = gulp.src(['./wwwroot/js/*.js'], { read: false });

    return target.pipe(inject(sources, {
        addRootSlash: false,
        ignorePath: 'wwwroot'
    })).pipe(gulp.dest(buildConfig.targets.wwwrootFolder));
});

function getMappedSourceFiles(files, baseFolder) {
    return files.map(function (file) {
        return path.join(baseFolder, file);
    });
}