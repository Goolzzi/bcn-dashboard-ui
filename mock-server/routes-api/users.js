'use strict';

let express = require('express');
let db = require('./userdb.json');
let router = express.Router();
let storage = require('node-persist');
let _ = require('lodash');

let users = [];

function initMocData() {
	storage.initSync();
	users = db.users;
}

// Returns a random number of milliseconds
// to delay, to simulate the latency of a real
// system
function fakeLatency() {
	let minMS = 500;
	let maxMS = 3000;
	return Math.floor((Math.random() * (maxMS - minMS)) + minMS)
}

// /v1/api/userManagement/resetPassword
router.post('/resetPassword', function (req, res) {
	console.log('POST ' + req.url);
	res.setHeader('Content-Type', 'application/json');

	// Parameters:  email address
	let emailAddress = req.body.emailAddress;

	if (!validEmail(emailAddress)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Could not find user in system",
					});
			},
			fakeLatency());
		return;
	}

	let tempPassword = generateTempPassword();
	let user = _.find(users, function (o) {
		return (o.email === emailAddress);
	}, emailAddress);

	user.tempPassword = tempPassword;
	setTimeout(function () {
			res.status(200)
				.send({
					"tempPassword": tempPassword
				})
		},
		fakeLatency()
	);
});

// /v1/api/userManagement/setPassword
router.post('/setPassword', function (req, res) {

	console.log('POST ' + req.url);

	let emailAddress = req.body.emailAddress;
	let tempPassword = req.body.temp_pw;
	let newPassword = req.body.new_pw;

	if (!validEmail(emailAddress)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Could not find user in system",
					});
			},
			fakeLatency());
		return;
	}

	if (!verifyTempPassword(emailAddress, tempPassword)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Incorrect temporary password specified",
					});
			},
			fakeLatency());
		return;
	}

	if (!validPassword(newPassword)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Password was not strong enough",
					});
			},
			fakeLatency());
		return;
	}


	let user = _.find(users, function (o) {
		return (o.email === emailAddress);
	}, emailAddress);

	user.tempPassword = null;
	user.password = newPassword;
	setTimeout(function () {
			res.status(200)
				.send()
		},
		fakeLatency()
	);
});


// /v1/api/userManagement/updatePassword
router.post('/updatePassword', function (req, res) {

	console.log('POST ' + req.url);
	// Parameters:  emailAddress, password, newPassword
	let emailAddress = req.body.emailAddress;
	let password = req.body.password;
	let newPassword = req.body.new_pw;

	if (!validEmail(emailAddress)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Could not find user in system",
					});
			},
			fakeLatency());
		return;
	}

	if (!verifyPassword(emailAddress, password)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Incorrect password specified",
					});
			},
			fakeLatency());
		return;
	}

	if (!validPassword(newPassword)) {
		setTimeout(function () {
				res.status(500)
					.send({
						"code": "INPUT_VALIDATION_ERROR",
						"brief": "Password was not strong enough",
					});
			},
			fakeLatency());
		return;
	}

	let user = _.find(users, function (o) {
		return (o.email === emailAddress);
	}, emailAddress);

	user.tempPassword = null;
	user.password = newPassword;

	setTimeout(function () {
			res.status(200)
				.send()
		},
		fakeLatency()
	);
});

function validPassword(password) {
	if (password === undefined || password == null || password.length < 8) {
		return false;
	}
	return true;
}

function verifyPassword(email, password) {
	if (password === undefined || password === null || password.length === 0) {
		return false;
	}
	let user = _.find(users, function (o) {
		return (o.email === email);
	}, email);

	if (user === undefined || user === null) {
		return false;
	}
	return (user.password === password);
}

function validEmail(email) {
	if (email === undefined || email === null || email.length === 0) {
		return false;
	}
	return (_.findIndex(users, function (o) {
		return (o.email === email);
	}, email) !== -1);
}

function verifyTempPassword(email, tempPassword) {
	if (tempPassword === undefined || tempPassword === null || tempPassword.length === 0) {
		return false;
	}
	let user = _.find(users, function (o) {
		return (o.email === email);
	}, email);
	if (user === undefined || user === null) {
		return false;
	}
	return (user.tempPassword === tempPassword);
}

function generateTempPassword() {
	var length = 8,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

module.exports = {
	router: router,
	initMocData: initMocData
};
