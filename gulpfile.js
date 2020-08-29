const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const glslify = require('./gulp/gulp-glslify');
const gulpif = require('gulp-if');
const gulpCopy = require('gulp-copy');

function isJavaScript(file) {
    // Check if file extension is '.js'
    return file.extname === '.js';
}

function isShader(file) {
    return file.extname === '.glsl';
}

function javascript(cb) {
    {
        return gulp.src(['./src/components/*.js', './src/shaders/*.glsl'])

            .pipe(sourcemaps.init())
            //   .pipe(gulpif(isJavaScript, terser()))
            .pipe(gulpif(isShader, glslify()))
            .pipe(concat('main.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./dist/'));
    }

}

function copyStatic(cb) {
    return gulp.src('./src/static/*')
        .pipe(gulpCopy('./dist', { prefix: 3 }));
}


gulp.task('watch', function () {
    return gulp.watch(['./src/components/*.js', './src/shaders/*.glsl'],
        { ignoreInitial: false },
        javascript);
});

function production() {
    return gulp.src(['./src/components/*.js', './src/shaders/*.glsl'])
        //   .pipe(sourcemaps.init())
        .pipe(gulpif(isJavaScript, terser()))
        .pipe(gulpif(isShader, glslify()))
        .pipe(concat('main.js'))
        //  .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'));
};

exports.default = gulp.series(copyStatic, javascript);
exports.copy = copyStatic;
exports.prod =  gulp.series(copyStatic, production);