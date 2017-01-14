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
  'jquery.js',
  'main.js'
];
var jsFilesSource = jsFiles.map(function(e) {return 'assets/js/source/' + e});
var jsFilesMinified = jsFiles.map(function(e) {return 'assets/js/minified/' + e});

gulp.task('js:watch', function() {
  gulp.src(jsFilesSource)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('js:build', function() {
  gulp.src(jsFilesMinified)
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});



// Imagemin
// Optimize all images

gulp.task('imagemin', function() {
  gulp.src('assets/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
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
  gulp.watch('assets/images/**/*', ['imagemin']);
});



// Clean 
// Clean 'build' folder

gulp.task('clean-build', function() {
  console.log('Cleaning build folder');
  return del('build/');
});



// Run Tasks

gulp.task('watch', ['pug:watch', 'stylus:watch', 'js:watch', 'imagemin', 'copy-fonts', 'browser-sync', 'watch-tasks']);
gulp.task('build', ['pug:build', 'stylus:build', 'js:build', 'imagemin', 'copy-fonts']);
gulp.task('clean', ['clean-build']);