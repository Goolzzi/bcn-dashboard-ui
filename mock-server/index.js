var bodyParser = require('body-parser')
var config = require('../gulp.config.js')
var https = require('https')
var path = require('path')
var argv = require('minimist')(process.argv.slice(2))
var fs = require('fs')
var initManagementMocData = require('./routes-api/management.js')
	.initManagementMocData;
var initCustomerMocData = require('./routes-api/customer.js')
	.initMocData;
var initUserMocData = require('./routes-api/users.js')
	.initMocData;
var initListMockData = require('./routes-api/list.js')
	.initListMockData;

var express = require('express')
var mustacheExpress = require('mustache-express');

function setupMockCustomerApi(port) {
	console.log('Staring mock customer-api at port: ' + port)
	var app = express();
	var httpsServer = https.createServer({
		key: fs.readFileSync('mock-server/ssl/key.pem'),
		cert: fs.readFileSync('mock-server/ssl/server.crt')
	}, app);

	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
		next();
	});

	app.use(bodyParser.json()); // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
		extended: true
	}));

	initManagementMocData();
	initCustomerMocData();
	initUserMocData();
	initListMockData();

	app.use('/v1/api/sPsettings/', require('./routes-api/settings.js'));
	app.use('/v1/api/customer/', require('./routes-api/customer.js')
		.router);
	app.use('/v2/api/spImage/', require('./routes-api/spig.js')
		.router);
	app.use('/v1/api/policyManagement/', require('./routes-api/management.js')
		.router);
	app.use('/v1/api/list/', require('./routes-api/list.js')
		.router);
	app.use('/v1/api/legal/', require('./routes-api/tos.js')
		.router);
	app.use('/v1/api/userManagement/', require('./routes-api/users.js')
		.router);
	app.use('/v1/api/list/dns/', require('./routes-api/list.js')
		.router);

	httpsServer.listen(port);
}

function setupMockCustomerUI(port, portApi) {
	console.log('Staring mock customer-ui at port: ' + port)
	var uiapp = express();

	uiapp.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
		next();
	});

	// Register '.html' extension with The Mustache Express
	uiapp.engine('html', mustacheExpress());
	uiapp.set('view engine', 'html'); // register file extension for partials
	uiapp.set('views', path.join(__dirname, '../dist/templ'));

	uiapp.use(express.static(path.join(__dirname, '../dist/static')));

	uiapp.use(bodyParser.json()); // to support JSON-encoded bodies
	uiapp.use(bodyParser.urlencoded({ // to support URL-encoded bodies
		extended: true
	}));

	uiapp.use('/v1/ui/', require('./routes-ui/ui.js'));

	uiapp.get('/', function (req, res) {
		console.log('About to serve intex.html');
		var cfg = {
			customerName: 'Vandelay Industries'
		};
		res.render('index', cfg);
	});

	uiapp.get('/config/', function (req, res) {
		console.log('Received:', req.body);
		res.setHeader('Content-Type', 'application/json');
		res.status(200)
			.send(JSON.stringify({
				config: "localhost:" + portApi
			}));
	});

	uiapp.listen(port);
}

function runMockServers(portUi, portApi) {
	setupMockCustomerApi(portApi);
	setupMockCustomerUI(portUi, portApi);
}

module.exports = runMockServers

if (!module.parent) {
	runMockServers(3005, 3443);
}
