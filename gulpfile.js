var gulp        = require('gulp'),
    pug         = require('gulp-pug'),
    stylus      = require('gulp-stylus'),
    jeet        = require('jeet'),
    nib         = require('nib'),
    rupture     = require('rupture'),
    browserSync = require('browser-sync').create(),
    imagemin    = require('gulp-imagemin'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    del         = require('del');




// HTML
// Compile Pug HTML

gulp.task('pug:watch', function() {
  var LOCALS = {};

  gulp.src('views/*.pug')
    .pipe(pug({
      locals: LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});


gulp.task('pug:build', function() {
  var LOCALS = {};

  gulp.src('views/*.pug')
    .pipe(pug({
      locals: LOCALS,
      pretty: false
    }))
    .pipe(gulp.dest('build/'));
});




// CSS
// Compile Stylus CSS

gulp.task('stylus:watch', function () {
  gulp.src('assets/styles/master.styl')
    .pipe(stylus({
      compress: false,
      use: [jeet(), nib(), rupture()]
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('stylus:build', function () {
  gulp.src('assets/styles/master.styl')
    .pipe(stylus({
      compress: true,
      use: [jeet(), nib(), rupture()]
    }))
    .pipe(gulp.dest('build/css'));
});



// JavaScript
// Concat, rename and uglify all JS

var jsFiles = [
  'assets/js/jquery.js',
  'assets/js/pace.js',
  'assets/js/TweenMax.js',
  'assets/js/bez.js',
  'assets/js/inview.js',
  'assets/js/main.js'
];

gulp.task('js:watch', function() {
  gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('js:build', function() {
  gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});



// Copy non-SVG images
// Copy non-SVG image files to /build

gulp.task('copy-non-svg', function() {
  gulp.src('assets/images/raster/**/*')
    .pipe(gulp.dest('build/images/raster'));
});



// Imagemin
// Process only SVG images

gulp.task('imagemin', function() {
  gulp.src('assets/images/vector/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images/vector'))
    .pipe(browserSync.stream());
});



// Copy fonts

gulp.task('copy-fonts', function() {
  gulp.src('assets/fonts/**/*')
    .pipe(gulp.dest('build/fonts/'))
});



// Browser Sync
// Reload on file changes in /build

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
});




// Watch
// Watch HTML and CSS compilation changes

gulp.task('watch-tasks', function() {
  gulp.watch('views/**/*.pug', ['pug:watch']);
  gulp.watch('assets/styles/**/*.styl', ['stylus:watch']);
  gulp.watch('assets/js/**/*.js', ['js:watch']);
  gulp.watch('assets/images/vector/**/*', ['imagemin']);
  gulp.watch('assets/images/raster/**/*', ['copy-non-svg']);
});



// Clean 
// Clean 'build' folder

gulp.task('clean-build', function() {
  console.log('Cleaning build folder');
  return del('build/');
});



// Run Tasks

gulp.task('watch', ['pug:watch', 'stylus:watch', 'js:watch', 'copy-non-svg', 'imagemin', 'copy-fonts', 'browser-sync', 'watch-tasks']);
gulp.task('build', ['pug:build', 'stylus:build', 'js:build', 'copy-non-svg', 'imagemin', 'copy-fonts']);
gulp.task('clean', ['clean-build']);