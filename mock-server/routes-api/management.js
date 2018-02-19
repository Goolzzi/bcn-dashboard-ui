'use strict';

let db = require('./db.json');
let _ = require('lodash');
let storage = require('node-persist');
let uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

let policies = [];

function initManagementMocData() {
	storage.initSync();
	policies = db.policies;

}

// Returns a random number of milliseconds
// to delay, to simulate the latency of a real
// system
function fakeLatency() {
	let minMS = 500;
	let maxMS = 3000;
	return Math.floor((Math.random() * (maxMS - minMS)) + minMS)
	// let min = Math.ceil(500);
	// let max = Math.floor(99999);
	// return Math.floor(Math.random() * (max - min)) + min;
}

// /v1/management/policies
router.get('/policies', function (req, res) {

	if (req.query.siteId !== undefined && req.query.siteGroupId !== undefined) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "INVALID_INPUT",
					"brief": "Only one of siteId or siteGroupId can be used"
				});
		}, fakeLatency());
		return;
	}

	res.setHeader('Content-Type', 'application/json');
	var policyList = policies;
	if (req.query.siteId === undefined && req.query.siteGroupId === undefined && req.query.domainListId === undefined) {
		// Nothing
	} else if (req.query.siteId !== undefined && req.query.domainListId === undefined && req.query.siteGroupId === undefined) {
		policyList = _.filter(policies, function (o) {
			return (_.some(o.appliedTo, function (a) {
				return (a.type === 'siteId' && a.name === req.query.siteId);
			}));
		});
	} else if (req.query.siteGroupId !== undefined && req.query.domainListId === undefined && req.query.siteId === undefined) {
		policyList = _.filter(policies, function (o) {
			return (_.some(o.appliedTo, function (a) {
				return (a.type === 'siteGroup' && a.name === req.query.siteGroupId);
			}));
		});
	} else if (req.query.domainListId !== undefined && req.query.siteId === undefined && req.query.siteGroupId === undefined) {
		policyList = _.filter(policies, function (o) {
			return (_.some(o.domain, function (a) {
				return (a.type === 'list' && a.name === req.query.domainListId);
			}));
		});
	} else {
		// Nothing
	}
	console.log('GET ' + req.url + ' returns ' + policyList.length + ' policies');
	setTimeout(function () {
			res.status(200)
				.send(policyList)
		},
		fakeLatency()
	);
});

// /v1/management/policies/create
router.post('/policies/create', function (req, res) {
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));

	if (!isRequestValid(req)) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "INPUT_VALIDATION_ERROR",
					"brief": "Provided Input is invalid."
				});
		}, fakeLatency());
	} else if ((req.body.action.type !== "allow" && req.body['exceptionDomainList'] !== undefined)) {
		setTimeout(function () {
			res.status(501)
				.send({
					"code": "INPUT_VALIDATION_ERROR",
					"brief": "Invalid Request Model's values"
				});
		}, fakeLatency());
	} else {
		let policyId = uuidV4();
		let newPolicy = {
			'policyId': policyId,
			'name': req.body.name,
			'description': req.body.description,
			'appliedTo': req.body.appliedTo,
			'domain': req.body.domain,
			'exceptionDomainList': req.body.exceptionDomainList,
			'action': req.body.action,
			'active': req.body.active
		};

		if (_.findIndex(policies, function (o) {
				return newPolicy.name === o.name
			}) !== -1) {

			setTimeout(function () {
					res.status(500)
						.send('{"code": "INVALID_INPUT", "brief": "Invalid Request Model\'s values"}')
				},
				fakeLatency()
			);
			return;
		}

		policies.push(newPolicy);
		setTimeout(function () {
				res.status(200)
					.send({
						"policyId": policyId
					});
			},
			fakeLatency()
		);
	}
});

// /v1/management/policies/{policyId}/update
router.post('/policies/:policyId/update', function (req, res) {
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));
	let policyId = req.params.policyId;
	if (!isRequestValid(req)) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "INPUT_VALIDATION_ERROR",
					"brief": "Invalid Request Model\'s values"
				});
		}, fakeLatency());
	} else if ((req.body.action.type !== "allow" && req.body['exceptionDomainList'] !== undefined)) {
		setTimeout(function () {
			res.status(501)
				.send({
					"code": "INPUT_VALIDATION_ERROR",
					"brief": "Invalid Request Model's values"
				});
		});
	} else {
		let foundIndex = _.findIndex(policies, function (o) {
			return policyId === o.policyId;
		});

		if (foundIndex === -1) {
			res.status(500)
				.send();
			return;
		}

		policies[foundIndex] = {

			'policyId': policyId,
			'name': req.body.name,
			'description': req.body.description,
			'appliedTo': req.body.appliedTo,
			'domain': req.body.domain,
			'exceptionDomainList': req.body.exceptionDomainList,
			'action': req.body.action,
			'active': req.body.active
		};

		if (_.findIndex(policies, function (o) {
				return req.body.name === o.name && policyId !== o.policyId
			}) !== -1) {

			setTimeout(function () {
					res.status(500)
						.send('{"code": "INVALID_INPUT", "brief": "Invalid Request Model\'s values"}')
				},
				fakeLatency()
			);
			return;
		}

		setTimeout(function () {
				res.status(200)
					.send();
			},
			fakeLatency()
		);
	}
});

// /v1/management/policies/{policyId}/delete
router.post('/policies/:policyId/delete', function (req, res) {
	console.log('POST' + req.url + ':' + JSON.stringify(req.body));

	var policyId = req.params.policyId;
	let foundIndex = _.findIndex(policies, function (o) {
		return policyId === o.policyId;
	});
	if (foundIndex !== -1) {
		policies.splice(foundIndex, 1);
	} else {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "ERROR_POLICY_NOT_FOUND",
					"brief": "No policy exists with given policy id."
				});
		}, fakeLatency());
		return;
	}
	setTimeout(function () {
		res.status(200)
			.send();
	}, fakeLatency());
});

function isRequestValid(req) {
	let result = true;
	if (req.body.length === 0) {
		result = false;
	} else if (req.body.description === undefined ||
		req.body.appliedTo === undefined ||
		req.body.domain === undefined ||
		req.body.action === undefined ||
		req.body.action.type === undefined) {
		result = false;
	} else if (req.body.name === undefined || req.body.name.length === 0 || req.body.name.length > 128) {
		result = false;
	} else if (req.body.action.type !== "block" && req.body.action.type !== "allow" && req.body.action.type !== "monitor") {
		result = false;
	} else if (req.body.active !== undefined && req.body.active !== true && req.body.active !== false) {
		result = false;
	}
	return result;
}

module.exports = {
	router: router,
	initManagementMocData: initManagementMocData
};
