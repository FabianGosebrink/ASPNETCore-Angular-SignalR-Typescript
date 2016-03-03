var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');

var buildConfig = require('./gulp.config');

gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

require('./gulpTasks/electron');
require('./gulpTasks/web');

gulp.task('build:all', function (done) {
    runSeq(
        //'common-clean-vendor-js-in-root',
        'build:electron:windows',
        done);
});