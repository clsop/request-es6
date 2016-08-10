const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const pump = require('pump');
const mocha = require('gulp-mocha');

const reporter = 'nyan';

const distBuild = 'build/dist';
const debugBuild = 'build/debug';
const testBuild = 'build/test';

gulp.task('default', ['dist', 'debug']);

/****************/
/* distribution */
/****************/
gulp.task('dist', (cb) => {
    var b = browserify({
        entries: 'src/HttpRequest.js',
        debug: false
    });

    pump([
        b.transform(babelify, {
            presets: ['es2015']
        }).bundle(),
        source('request-es6.js'),
        buffer(),
        uglify(),
        gulp.dest(distBuild)
    ], cb);
});

gulp.task('debug', (cb) => {
    var b = browserify({
        entries: 'src/HttpRequest.js',
        debug: true
    });

    pump([
        b.transform(babelify, {
            presets: ['es2015']
        }).bundle(),
        source('request-es6.js'),
        buffer(),
        sourcemaps.init({
            loadMaps: true,
            debug: true
        }),
        uglify({
            mangle: false,
            preserveComments: 'all'
        }),
        sourcemaps.write(),
        gulp.dest(debugBuild)
    ], cb);
});

/***************/
/* build tests */
/***************/
gulp.task('build-tests', (cb) => {
    var b = browserify({
        entries: ['test/object.js', 'test/common.js', 'test/success.js', 'test/fail.js'],
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015']
        })
        .bundle(),
        source('tests.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-success-tests', (cb) => {
    var b = browserify({
        entries: 'test/success.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015']
        })
        .bundle(),
        source('success.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-fail-tests', (cb) => {
    var b = browserify({
        entries: 'test/fail.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015']
        })
        .bundle(),
        source('fail.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-object-tests', (cb) => {
    var b = browserify({
        entries: 'test/object.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015']
        })
        .bundle(),
        source('object.js'),
        buffer(),
        gulp.dest(testBuild)
    ], cb);
});

gulp.task('build-common-tests', (cb) => {
    var b = browserify({
        entries: 'test/common.js',
        debug: true
    });

    pump([b.transform(babelify, {
            presets: ['es2015']
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
    return gulp.src(testBuild + '/tests.js', {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:success', ['build-success-tests'], () => {
    return gulp.src(testBuild + '/success.js', {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:fail', ['build-fail-tests'], () => {
    return gulp.src(testBuild + '/fail.js', {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:object', ['build-object-tests'], () => {
    return gulp.src(testBuild + '/object.js', {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:common', ['build-common-tests'], () => {
    return gulp.src(testBuild + '/common.js', {
            read: false
        })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});