/**
 * Serve
 * @author: Alexander Luksidadi
 */

var config = require('../../gulp.config.js'),
	express = require('express'),
	gulp = require('gulp'),
	runMockServers = require('../../mock-server')

gulp.task('serve', function () {
	runMockServers(3005, 3443);
});
