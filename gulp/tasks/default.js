/**
 * Default task when running `gulp`
 * @author: Alexander Luksidadi
 */

var gulp = require('gulp'),
	argv = require('yargs')
	.argv,
	runSequence = require('run-sequence');

gulp.task('default', function (cb) {
	if (argv.nomock) {
		runSequence('clean', 'bundle', 'browser-sync-nomock');
	} else {
		runSequence('clean', 'bundle', 'serve', 'browser-sync');
	}
});
