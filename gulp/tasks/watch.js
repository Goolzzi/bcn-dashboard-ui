/**
 * Watch files changes
 * @author: Alexander Luksidadi
 */

var gulp = require('gulp'),
	config = require('../../gulp.config.js'),
	runSequence = require('run-sequence');

gulp.task('watch', [], function (cb) {
	gulp.watch(config.fonts.src, ['fonts']);
	gulp.watch(config.images.src, ['images']);
	gulp.watch(config.styles.src, ['styles']);
	gulp.watch(config.htdocs.src, ['htdocs']);
	gulp.watch(config.scripts.src, ['bundle']);
	cb();
});
