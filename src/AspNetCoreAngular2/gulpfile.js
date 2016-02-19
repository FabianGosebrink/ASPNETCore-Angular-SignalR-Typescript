var gulp = require('gulp');
var runSeq = require('run-sequence');
var electron = require('gulp-atom-electron');
var symdest = require('gulp-symdest');
var del = require('del');
var NwBuilder = require('nw-builder');
var taskListing = require('gulp-task-listing');
 
gulp.task('default', ['help']);
gulp.task('help', taskListing.withFilters(/-/));

var buildConfig = require('./gulp.config');

gulp.task('electron:windows', function(done){  
    runSeq(
        'clean-temp-electron',
        'copy-electron-files', 
        'copy-fonts-to-electron-temp',
        //'build-electron', 
        done);
});

gulp.task('nwjs:windows', function(done){  
    runSeq(
        'clean-temp-nwjs',
        'copy-nwjs-files', 
        'copy-fonts-to-nwjs-temp',
        'nwjs-build-node-webkit',
        done);
});

gulp.task('copy:vendor:js:to:wwwroot', function(done){  
    runSeq(
        'clean-vendor-js-in-root',
        'copy-vendor-js-to-wwwroot', 
        done);
});

gulp.task('copy-vendor-js-to-wwwroot', function () {
    return gulp.src(buildConfig.config.vendorJsFiles)
        .pipe(gulp.dest(buildConfig.config.rootJsFolder))
});

gulp.task('copy-nwjs-files', function(done){  
    return gulp.src([
         buildConfig.config.assets.nwjs,
       buildConfig.config.app.allJsFiles,
        buildConfig.config.app.allCssFiles,
        buildConfig.config.app.allHtmlFiles,
        buildConfig.config.app.indexHtmlFile
    ]).pipe(gulp.dest(buildConfig.config.temp.nwjs));
});

gulp.task('copy-fonts-to-nwjs-temp', function(done){  
    return gulp.src(
        buildConfig.config.allRootFontsFiles
    ).pipe(gulp.dest(buildConfig.config.temp.nwjsFonts));
});

gulp.task('nwjs-build-node-webkit', function () {

    var sourcefiles = buildConfig.config.temp.allNwjsFiles;
    var targetpath = buildConfig.config.dist.nwjsFolder;

    var nw = new NwBuilder({
        version: '0.12.3',
        files: sourcefiles, // use the glob format
        buildDir: targetpath,
        platforms: ['win32']
        //platforms: ['osx32', 'osx64', 'win32', 'win64', 'linux32','linux64']
    });

    nw.on('log', console.log);
 
    // Build returns a promise
    nw.build().then(function () {
        console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });

});

gulp.task('copy-fonts-to-electron-temp', function(done){  
    return gulp.src(
        buildConfig.config.allRootFontsFiles
    ).pipe(gulp.dest(buildConfig.config.temp.electronFonts));
});

gulp.task('copy-electron-files', function(done){  
    return gulp.src([
        buildConfig.config.assets.electron,
        buildConfig.config.app.allJsFiles,
        buildConfig.config.app.allCssFiles,
        buildConfig.config.app.allHtmlFiles,
        buildConfig.config.app.indexHtmlFile
    ]).pipe(gulp.dest(buildConfig.config.temp.electron));
});

gulp.task('build-electron', function(done){  
    return gulp.src(buildConfig.config.temp.allElectronFiles)
        .pipe(electron({
            version: '0.36.7',
            platform: 'win32' }))
        .pipe(symdest(buildConfig.config.dist.electronFolder + 'win'));
});

gulp.task('clean-vendor-js-in-root', function(done){  
       return del(buildConfig.config.temp.allRootVendorJsFiles, done);
});

gulp.task('clean-temp-electron', function(done){  
       return del(buildConfig.config.temp.electron, done);
});

gulp.task('clean-temp-nwjs', function(done){  
       return del(buildConfig.config.temp.nwjs, done);
});