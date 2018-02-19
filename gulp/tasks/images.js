/**
 * Copy and optimize images
 * @author: Alexander Luksidadi
 */

var changed = require('gulp-changed'),
	config = require('../../gulp.config.js'),
	gulp = require('gulp'),
	size = require('gulp-size');

gulp.task('images', function () {
	return gulp.src(config.images.src)
		.pipe(changed(config.images.dest))
		.pipe(gulp.dest(config.images.dest))
		.pipe(size({
			title: 'images'
		}));
});
