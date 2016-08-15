var gulp = require('gulp'),
		pug = require('gulp-pug'),
		stylus = require('gulp-stylus'),
		jeet = require('jeet'),
		nib = require('nib'),
		rupture = require('rupture'),
		browserSync = require('browser-sync').create(),
		imagemin = require('gulp-imagemin'),
		concat = require('gulp-concat'),
		rename = require('gulp-rename'),
		uglify = require('gulp-uglify'),
		ignore = require('gulp-ignore');




// HTML
// Compile Pug HTML

gulp.task('pug', function() {
	var LOCALS = {};

	gulp.src('./src/*.pug')
		.pipe(pug({
			locals: LOCALS,
			pretty: false
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});




// CSS
// Compile minified Stylus CSS using Plugins

gulp.task('stylus', function () {
	gulp.src('./src/styles/*.styl')
		.pipe(stylus({
			compress: true,
			use: [jeet(), nib(), rupture()]
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});



// JavaScript
// Concat, rename and uglify all JS

var jsFiles = [
	'src/js/jquery.js',
	'src/js/main.js'
];

gulp.task('concat', function() {
	gulp.src(jsFiles)
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(rename('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});



// Copy non-SVG images
// Copy non-SVG image files to /dist

gulp.task('copy-non-svg', function() {
	gulp.src(['src/images/**/*', '!./src/images/**/*.svg'])
		.pipe(gulp.dest('dist/images/'));
});



// Imagemin
// Compress only SVG images

gulp.task('imagemin', function() {
	gulp.src('src/images/**/*.svg')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
		.pipe(browserSync.stream());
});



// Browser Sync
// Reload on file changes in /dist

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./dist/"
		}
	});
});




// Watch
// Watch HTML and CSS compilation changes

gulp.task('watch', function() {
	gulp.watch('src/**/*.pug', ['pug']);
	gulp.watch('src/styles/master.styl', ['stylus']);
	gulp.watch('src/**/*.js', ['concat']);
	gulp.watch('src/images/**/*.svg', ['imagemin']);
	gulp.watch(['src/images/**/*', '!./src/images/**/*.svg'], ['copy-non-svg']);
});




// Default Task
// Run Everything

gulp.task('default', ['pug', 'stylus', 'concat', 'copy-non-svg', 'imagemin', 'browser-sync', 'watch']);