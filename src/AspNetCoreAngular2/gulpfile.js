var gulp = require('gulp');
var runSeq = require('run-sequence');
var taskListing = require('gulp-task-listing');

var buildConfig = require('./gulp.config');

gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

require('./gulpTasks/electron');
require('./gulpTasks/web');
require('./gulpTasks/cordova');

gulp.task('build:all', function (done) {
    runSeq(
        'build:web:prod',
        'build:electron',
        'build:apps',
        done);
});