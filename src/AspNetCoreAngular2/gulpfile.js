var gulp = require('gulp');
var runSeq = require('run-sequence');
var taskListing = require('gulp-task-listing');

var buildConfig = require('./gulp.config');

gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

require('./gulpTasks/electron');
require('./gulpTasks/web');

gulp.task('build:all:prod', function (done) {
    runSeq(
        'web:build:prod',
        'build:electron:windows',
        done);
});