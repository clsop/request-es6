const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const pump = require('pump');
const mocha = require('gulp-mocha');

const reporter = 'spec';
const bailOnFirstFail = false;

const distBuild = 'build/dist';
const debugBuild = 'build/debug';
const testBuild = 'build/test';

gulp.task('default', ['dist', 'debug']);

/****************/
/* distribution */
/****************/
gulp.task('dist', (cb) => {
    let b = browserify({
        entries: 'src/HttpRequest.js',
        debug: false
    });

    pump([
        b.transform(babelify, {
            presets: ['es2015']
        }).bundle(),
        source('request.js'),
        buffer(),
        uglify({
            mangle: true
        }),
        gulp.dest(distBuild)
    ], cb);
});

gulp.task('debug', (cb) => {
    let b = browserify({
        entries: 'src/HttpRequest.js',
        debug: true
    });

    pump([
        b.transform(babelify, {
            presets: ['es2015']
        }).bundle(),
        source('request.js'),
        buffer(),
        sourcemaps.init({
            loadMaps: true,
            debug: true
        }),
        sourcemaps.write(),
        gulp.dest(debugBuild)
    ], cb);
});

/***************/
/* build tests */
/***************/
gulp.task('build-tests', (cb) => {
    let b = browserify({
        entries: ['test/object.js', 'test/common.js', 'test/success.js', 'test/fail.js'],
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015-node']
        })
        .bundle(),
        source('tests.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-success-tests', (cb) => {
    let b = browserify({
        entries: 'test/success.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015-node']
        })
        .bundle(),
        source('success.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-fail-tests', (cb) => {
    let b = browserify({
        entries: 'test/fail.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015-node']
        })
        .bundle(),
        source('fail.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-object-tests', (cb) => {
    let b = browserify({
        entries: 'test/object.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015-node']
        })
        .bundle(),
        source('object.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-common-tests', (cb) => {
    let b = browserify({
        entries: 'test/common.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015-node']
        })
        .bundle(),
        source('common.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

/*************/
/* run tests */
/*************/
gulp.task('tests', ['build-tests'], () => {
    return gulp.src(`${testBuild}/tests.js`, {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: bailOnFirstFail
        }));
});

gulp.task('tests:success', ['build-success-tests'], () => {
    return gulp.src(`${testBuild}/success.js`, {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: bailOnFirstFail
        }));
});

gulp.task('tests:fail', ['build-fail-tests'], () => {
    return gulp.src(`${testBuild}/fail.js`, {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: bailOnFirstFail
        }));
});

gulp.task('tests:object', ['build-object-tests'], () => {
    return gulp.src(`${testBuild}/object.js`, {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: bailOnFirstFail
        }));
});

gulp.task('tests:common', ['build-common-tests'], () => {
    return gulp.src(`${testBuild}/common.js`, {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: bailOnFirstFail
        }));
});