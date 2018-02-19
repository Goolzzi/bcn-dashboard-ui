/**
 * Import all gulp tasks
 * @author: Alexander Luksidadi
 */

var fs = require('fs'),
	path = require('path');

/** Make sure that only .js files are included as tasks */
var onlyJs = function (fileName) {
	return /(\.(js)$)/i.test(path.extname(fileName));
};

/** Read gulp/tasks directory and check for .js files */
var tasks = fs.readdirSync('./gulp/tasks/')
	.filter(onlyJs);

/** Import all the gulp tasks */
tasks.forEach(function (task) {
	require('./tasks/' + task);
});
