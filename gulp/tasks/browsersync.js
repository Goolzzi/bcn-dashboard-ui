/**
 * Serve
 * @author: Alexander Luksidadi
 */

var config = require('../../gulp.config.js'),
	url = require('url'),
	gulp = require('gulp'),
	proxy = require('proxy-middleware'),
	browserSync = require('browser-sync')
	.create();

function createProxyOptions(route, target) {
	var options = url.parse(target);
	options.route = route;
	return options;
}

gulp.task('browser-sync', function () {
	// Note another proxy can be added to array below to mock customer-api

	browserSync.init({
		proxy: "http://127.0.0.1:3005"
	});

	gulp.watch(config.fonts.src, ['fonts-watch']);
	gulp.watch(config.images.src, ['images-watch']);
	gulp.watch(config.styles.src, ['styles-watch']);
	gulp.watch(config.htdocs.src, ['htdocs-watch']);
	gulp.watch(config.scripts.src, ['bundle-watch']);
});

// create a task that ensures the watch tasks are complete before
// reloading browsers
gulp.task('fonts-watch', ['fonts'], browserSync.reload);
gulp.task('images-watch', ['images'], browserSync.reload);
gulp.task('styles-watch', ['styles'], browserSync.reload);
gulp.task('htdocs-watch', ['htdocs'], browserSync.reload);
gulp.task('bundle-watch', ['bundle'], browserSync.reload);
