var config = require('../../gulp.config.js'),
	url = require('url');
gulp = require('gulp'),
	proxy = require('proxy-middleware'),
	browserSync = require('browser-sync')
	.create();

gulp.task('browser-sync-nomock', function () {

	var proxyOptions = url.parse('http://localhost:3000/v1/ui');
	proxyOptions.route = '/v1/ui'

	browserSync.init({
		server: {
			baseDir: config.root_dir + '/' + config.build_path,
			middleware: [proxy(proxyOptions)]
		}
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
