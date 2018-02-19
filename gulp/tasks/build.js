/**
 * Build project
 * @author: Alexander Luksidadi
 */

var gulp = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('build', function (cb) {
	runSequence('clean', 'bundle');
});
