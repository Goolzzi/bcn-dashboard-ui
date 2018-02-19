/**
 * Clean distribution files
 * @author: Alexander Luksidadi
 */

var gulp = require('gulp'),
	config = require('../../gulp.config.js'),
	del = require('del');

gulp.task('clean', del.bind(
	null, [config.build_path], {
		dot: true,
		force: true
	}
));
