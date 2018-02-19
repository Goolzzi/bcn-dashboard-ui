var express = require('express');
var router = express.Router();

var __defaultSetting = [{
	ipAddress: ""
}];

// define the home page route
router.get('/global', function (req, res) {
	const response = {
		servers: __defaultSetting
	};
	res.setHeader('Content-Type', 'application/json');
	res.status(200)
		.send(JSON.stringify(response));
});

router.get('/factory', function (req, res) {
	const response = {
		servers: [{
			ipAddress: "8.8.8.8"
		}]
	};
	res.setHeader('Content-Type', 'application/json');
	res.status(200)
		.send(JSON.stringify(response));
});

router.post('/global/update', function (req, res) {
	console.log('/global/update');
	if (req.body) {
		var request = req.body;
		__defaultSetting = request.servers;
	}
	res.status(200)
		.send();
});

module.exports = router;
