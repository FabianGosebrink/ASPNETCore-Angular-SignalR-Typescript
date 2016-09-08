/// <binding BeforeBuild='build:web:dev' />
var gulp = require('gulp');
var runSeq = require('run-sequence');
var taskListing = require('gulp-task-listing');

gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

require('./gulpTasks/electron');
require('./gulpTasks/web');
require('./gulpTasks/cordova');

gulp.task('build:all', function (done) {
    runSeq(
        //'build:web:dev',
        'build:web:prod',
        'build:electron',
        'build:apps',
        done);
});