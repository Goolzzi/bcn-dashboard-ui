/**
 * Copy fonts
 * @author: Alexander Luksidadi
 */

var changed = require('gulp-changed'),
	config = require('../../gulp.config.js'),
	gulp = require('gulp'),
	size = require('gulp-size');

gulp.task('fonts', function () {
	return gulp.src(config.fonts.src)
		.pipe(changed(config.fonts.dest))
		.pipe(gulp.dest(config.fonts.dest))
		.pipe(size({
			title: 'fonts'
		}));
});
