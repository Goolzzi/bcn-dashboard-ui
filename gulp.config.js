/**
 * Gulp config file
 * @module
 * @author: Alexander Luksidadi
 */

var argv = require('minimist')(process.argv.slice(2));

var config = {};

/** root directory */
config.root_dir = __dirname;

/** build path */
config.build_path = 'dist';

/**
 * verbose flag: used to print out all logs from gulp tasks
 * @example: `$ gulp --verbose`
 */
config.verbose = !!argv.verbose;

/**
 * release flag: used to build the project for production
 * @example: `$ gulp --release`
 */
config.release = !!argv.release;

/** templates config */
config.templ = {
	src: ['src/templ/**/*.{html,json}'],
	dest: config.build_path + '/templ'
};

/** htdocs config */
config.htdocs = {
	src: ['src/htdocs/**/*'],
	dest: config.build_path + '/static'
};

/** images config */
config.images = {
	src: ['src/images/**/*.{jpg,png,gif,jpeg}'],
	dest: config.build_path + '/static/images'
};

/** fonts config */
config.fonts = {
	src: ['node_modules/font-awesome/fonts/*', 'node_modules/bootstrap/fonts/*'],
	dest: config.build_path + '/static/fonts'
};

/** scripts config */
config.scripts = {
	src: ['src/scripts/**/*'],
	dest: config.build_path + '/static/scripts'
};

/** styles config */
config.styles = {
	src: ['src/styles/**/*.{css,less}'],
	dest: config.build_path + '/static/styles'
};

/** api dev server */
config.api_server_port = 3005;

module.exports = config;
