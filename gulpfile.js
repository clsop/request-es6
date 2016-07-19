const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const mocha = require('gulp-mocha');

gulp.task('build-tests', () => {
    var b = browserify({
        entries: ['test/spec/object.js', 'test/spec/success.js', 'test/spec/fails.js'],
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('tests.js'))
    .pipe(buffer())
    .pipe(gulp.dest('test'));
});

gulp.task('build-success-tests', () => {
    var b = browserify({
        entries: 'test/spec/success.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('success.js'))
    .pipe(buffer())
    .pipe(gulp.dest('test'));
});

gulp.task('build-fail-tests', () => {
    var b = browserify({
        entries: 'test/spec/fails.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('fails.js'))
    .pipe(buffer())
    .pipe(gulp.dest('test'));
});

gulp.task('build-object-tests', () => {
    var b = browserify({
        entries: 'test/spec/object.js',
        debug: true
    });

    return b.transform(babelify, {
        presets: ['es2015']
    })
    .bundle()
    .on("error", (err) => { console.log("Error : " + err.message); })
    .pipe(source('object.js'))
    .pipe(buffer())
    .pipe(gulp.dest('test'));
});

gulp.task('tests', ['build-tests'], () => {
	return gulp.src('test/tests.js', { read: false })
		.pipe(mocha({
			reporter: 'nyan',
			ui: 'tdd',
			bail: true
		}));
});

gulp.task('success-tests', ['build-success-tests'], () => {
    return gulp.src('test/success.js', { read: false })
        .pipe(mocha({
            reporter: 'nyan',
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('fail-tests', ['build-fail-tests'], () => {
    return gulp.src('test/fails.js', { read: false })
        .pipe(mocha({
            reporter: 'nyan',
            ui: 'tdd',
            bail: true
        }));
});

gulp.task('object-tests', ['build-object-tests'], () => {
    return gulp.src('test/object.js', { read: false })
        .pipe(mocha({
            reporter: 'nyan',
            ui: 'tdd',
            bail: true
        }));
});