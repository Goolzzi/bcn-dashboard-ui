/**
 * Bundle with webpack
 * @author: Alexander Luksidadi
 */

var config = require('../../gulp.config.js'),
	gulp = require('gulp'),
	util = require('gulp-util'),
	webpack = require('webpack');

// Bundle
gulp.task('bundle', ['fonts', 'images', 'styles', 'htdocs', 'templ'], function (cb) {
	var started = false;
	var wpconfig = require('../../webpack.config.js');
	var bundler = webpack(wpconfig);

	function bundle(err, stats) {
		if (err) {
			throw new util.PluginError('webpack', err);
		}

		// if (config.verbose) {
		util.log('[webpack]', stats.toString({
			colors: true
		}));
		// }

		if (!started) {
			started = true;
			return cb();
		}
	}

	bundler.run(bundle);
});
