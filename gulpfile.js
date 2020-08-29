var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const glslify = require('./gulp/gulp-glslify');
const gulpif = require('gulp-if');


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
  
gulp.task('default', javascript);

gulp.task('watch', function () {
    return gulp.watch(['./src/components/*.js', './src/shaders/*.glsl'], 
    { ignoreInitial: false },
    javascript);
});

gulp.task('prod', function () {
    return gulp.src(['./src/components/*.js', './src/shaders/*.glsl'])
        //   .pipe(sourcemaps.init())
        .pipe(gulpif(isJavaScript, terser()))
        .pipe(gulpif(isShader, glslify()))
        .pipe(concat('main.js'))
        //  .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'));
});
