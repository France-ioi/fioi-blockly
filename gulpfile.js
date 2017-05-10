// very simple compiler

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
  return gulp.src(['base.js', 'core/*.js', 'msg/js/*.js', 'msg/*.js', 'blocks/*.js', 'generators/*.js', 'generators/javascript/*.js', 'generators/python/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('fioi-blockly.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js']);
