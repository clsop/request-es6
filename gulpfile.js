const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const mocha = require('gulp-mocha');

const reporter = 'nyan';
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
