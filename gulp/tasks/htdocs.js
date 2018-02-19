/**
 * Copy and minimize htdocs
 * @author: Alexander Luksidadi
 */

var changed = require('gulp-changed'),
	config = require('../../gulp.config.js'),
	gulp = require('gulp'),
	//htmlmin = require('gulp-htmlmin'),
	size = require('gulp-size');

gulp.task('htdocs', function () {
	return gulp.src(config.htdocs.src)
		.pipe(changed(config.htdocs.dest))
		//.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(config.htdocs.dest))
		.pipe(size({
			title: 'htdocs'
		}));
});
