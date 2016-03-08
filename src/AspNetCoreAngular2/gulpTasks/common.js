var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var taskListing = require('gulp-task-listing');
var concat = require('gulp-concat');
var path = require('path');

var buildConfig = require('../gulp.config');

function copyVendorJsToWwwroot() {
    cleanVendorJsInRoot();
    copyVendorJsToWwwrootInternal();
}

function cleanVendorJsInRoot() {
    return del(buildConfig.temp.allRootVendorJsFiles);
}

function copyVendorJsToWwwrootInternal() {
    return gulp.src(buildConfig.sources.jsFilesInclSourcePaths)
        .pipe(gulp.dest(buildConfig.rootJsFolder))
}

function cleanAppJsAndJsmap() {
    return del([
        "./wwwroot/**/*.js",
        "./wwwroot/**/*.js.map",
        "!./wwwroot/js/*.js"
    ]);
}

function copyToDist(folder) {
    return gulp.src([
        folder
    ])
        .pipe(gulp.dest(buildConfig.dist.folder));
}

module.exports = {
    copyVendorJsToWwwroot: copyVendorJsToWwwroot,
    copyToDist: copyToDist
};