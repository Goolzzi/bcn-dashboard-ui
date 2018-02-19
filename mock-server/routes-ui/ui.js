var express = require('express');
var router = express.Router();


var isAdmin = true;

router.post('/authenticate', function (req, res) {
	if (req.body) {
		console.log('Received:', req.body);
		var shouldFail = (req.body.email.search(/fail/i) >= 0) ? true : false;
		if (shouldFail) {
			res.status(500)
				.send({
					code: 'FAILED'
				});
			return;
		}

		isAdmin = (req.body.email.search(/admin/i) >= 0) ? true : false;
		var response = {
			token: 'mocktoken',
			token_timeout: 30,
			idle_timeout: 900
		}
		res.status(200)
			.send(JSON.stringify(response));
	} else {
		res.status(400)
			.send('Did not receive auth data');
	}
});

router.post('/logout', function (req, res) {
	if (req.body) {
		console.log('Received:', req.body);
		res.status(200)
			.send();
	} else {
		res.status(400)
			.send('Did not receive auth data');
	}
});

router.post('/userinfo', function (req, res) {
	if (req.body) {
		console.log('Received:', req.body);
		res.setHeader('Content-Type', 'application/json');
		var response = {
			username: 'Jean-Luc',
			role: (isAdmin ? 'ADMIN' : 'ANALYST')
		}
		res.status(200)
			.send(JSON.stringify(response));
	} else {
		res.status(400)
			.send('Did not receive auth data');
	}
});

router.post('/refresh', function (req, res) {
	if (req.body) {
		console.log('Received:', req.body);
		var response = {
			token: 'mocktoken'
		};
		res.status(200)
			.send(JSON.stringify(response));
	} else {
		res.status(400)
			.send('Did not receive auth data');
	}
});

module.exports = router;
