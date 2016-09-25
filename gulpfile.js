var gulp = require('gulp')
var less = require('gulp-less')
var gp_concat = require('gulp-concat')
var gp_rename = require('gulp-rename')
var gp_uglify = require('gulp-uglify')
var to5 = require('gulp-6to5')
var path = require('path')

gulp.task('less', function () {
  gulp.src('./public/style.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'))
})

gulp.task('es6-es5', function(){
	return gulp.src([
				'./public/src/serverapp.js',
				'./public/src/*/**.js',
				'./public/src/*/*/**.js'
			]
		)
		.pipe(to5())
		.pipe(gulp.dest('./public/build/es5/'))
})

gulp.task('build', function(){
    return gulp.src(
    		[
				'./public/js/jquery.js',
				'./public/js/plugins.js',
				'./public/js/functions.js'
    		]
    	)
        .pipe(gp_concat('gulp-concat.js'))
        .pipe(gulp.dest('./public/min/'))
        .pipe(gp_rename('vendor.min.js'))
        .pipe(gp_uglify())
        .pipe(gulp.dest('./public/build/'));
})

gulp.task('watch', function() {
    gulp.watch(['./public/less/**.less', './public/src/serverapp.js', './public/src/*/**.js', './public/src/*/*/**.js'], ['less', 'es6-es5'])
})

gulp.task('default', ['less', 'es6-es5', 'build', 'watch'], function(){})
