/**
 * Copy templ 
 */

var changed = require('gulp-changed'),
	config = require('../../gulp.config.js'),
	gulp = require('gulp'),
	size = require('gulp-size');

gulp.task('templ', function () {
	return gulp.src(config.templ.src)
		.pipe(changed(config.templ.dest))
		.pipe(gulp.dest(config.templ.dest))
		.pipe(size({
			title: 'templ'
		}));
});
