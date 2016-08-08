const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const mocha = require('gulp-mocha');

const reporter = 'nyan';
const testBuild = 'build/test';
const distBuild = 'build/dist';

gulp.task('default', ['dist:amd', 'dist:commonjs']);

gulp.task('dist:amd', () => {
    var b = browserify({
        entries: ['src/Response.js', 'src/FailResponse.js', 'src/HttpRequest.js',
            'src/exceptions/InvalidFunctionError.js', 'src/exceptions/HttpResponseError.js', 'src/exceptions/HttpRequestError.js'],
        debug: false
    });

    return b.transform(babelify, {
        presets: ['es2015'],
        plugins: ['transform-es2015-modules-amd']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('request_amd.js'))
    .pipe(buffer())
    .pipe(gulp.dest(distBuild));
});

gulp.task('dist:commonjs', () => {
    var b = browserify({
        entries: 'src/HttpRequest.js',
        debug: false
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('request_commonjs.js'))
    .pipe(buffer())
    .pipe(gulp.dest(distBuild));
});

gulp.task('build-tests', () => {
    var b = browserify({
        entries: ['test/object.js', 'test/success.js', 'test/fails.js', 'test/commons.js'],
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('tests.js'))
    .pipe(buffer())
    .pipe(gulp.dest(testBuild));
});

gulp.task('build-success-tests', () => {
    var b = browserify({
        entries: 'test/success.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('success.js'))
    .pipe(buffer())
    .pipe(gulp.dest(testBuild));
});

gulp.task('build-fail-tests', () => {
    var b = browserify({
        entries: 'test/fails.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('fails.js'))
    .pipe(buffer())
    .pipe(gulp.dest(testBuild));
});

gulp.task('build-object-tests', () => {
    var b = browserify({
        entries: 'test/object.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('object.js'))
    .pipe(buffer())
    .pipe(gulp.dest(testBuild));
});

gulp.task('build-commons-tests', () => {
    var b = browserify({
        entries: 'test/commons.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('commons.js'))
    .pipe(buffer())
    .pipe(gulp.dest(testBuild));
});

gulp.task('tests', ['build-tests'], () => {
	return gulp.src(testBuild + '/tests.js', { read: false })
		.pipe(mocha({
			reporter: reporter,
			ui: 'tdd',
			bail: true
		}));
});

gulp.task('tests:success', ['build-success-tests'], () => {
    return gulp.src(testBuild + '/success.js', { read: false })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:fail', ['build-fail-tests'], () => {
    return gulp.src(testBuild + '/fails.js', { read: false })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:object', ['build-object-tests'], () => {
    return gulp.src(testBuild + '/object.js', { read: false })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('tests:common', ['build-commons-tests'], () => {
    return gulp.src(testBuild + '/commons.js', { read: false })
        .pipe(mocha({
            reporter: reporter,
            ui: 'tdd',
            bail: true
        }));
});