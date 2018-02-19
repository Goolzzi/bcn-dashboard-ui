/**
 * Styles task
 * @author: Alexander Luksidadi
 */

var _if = require('gulp-if'),
	autoprefixer = require('gulp-autoprefixer'),
	config = require('../../gulp.config.js'),
	csscomb = require('gulp-csscomb'),
	gulp = require('gulp'),
	less = require('gulp-less'),
	cssnano = require('gulp-cssnano'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size');

// CSS style sheets
gulp.task('styles', function () {
	return gulp.src(config.styles.src)
		.pipe(plumber())
		.pipe(less({
			paths: [config.root_dir + '/node_modules'],
			sourceMap: !config.release,
			sourceMapBasepath: config.root_dir
		}))
		.on('error', (e) => {
			console.error(e);
			process.exit(1)
		})
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(csscomb())
		.pipe(_if(config.release, cssnano()))
		.pipe(gulp.dest(config.styles.dest))
		.pipe(size({
			title: 'styles'
		}));
});
