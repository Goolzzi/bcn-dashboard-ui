'use strict';

let uuidV4 = require('uuid/v4');
let db = require('./db.json');
let _ = require('lodash');
let storage = require('node-persist');
let spig = require('./spig')
	.spig;
let naturalCompare = require('natural-compare-lite');
let express = require('express');
let router = express.Router();

let delay = 2000;
let maxTargaDnsLogs = 2000;
let maxAvionDnsLogs = 1000;

let customerSites = [];

let customerSiteGroups = [];

function initMocData() {
	// init store
	storage.initSync();

	customerSiteGroups = db.siteGroups;
	customerSites = db.sites;

	for (let k = 0; k < db.dnsQueries.length; ++k) {
		let entry = db.dnsQueries[k];
		let rid = entry.time;
		entry.recordId = rid; // Use time for record ID
		let queries = [];

		// Generate logs for Targa in the past
		if (entry.site === 'Targa') {
			for (let i = 0; i < maxTargaDnsLogs; ++i) {
				let nextEntry = {};
				for (let attr in entry) {
					if (entry.hasOwnProperty(attr)) {
						nextEntry[attr] = entry[attr];
					}
				}

				--rid;

				nextEntry.time = rid;
				nextEntry.recordId = rid;
				nextEntry.query = 'www.' + rid + '.com';
				queries.push(nextEntry);

			}
		}

		if (entry.site === 'Toronto') {
			let actions = ['query-response', 'monitor', 'whitelist', 'blacklist', 'block'];
			for (let action of actions) {
				let nextEntry = {};
				for (let attr in entry) {
					if (entry.hasOwnProperty(attr)) {
						nextEntry[attr] = entry[attr];
					}
				}

				--rid;

				nextEntry.actionTaken = action;
				nextEntry.time = rid;
				nextEntry.recordId = rid;
				nextEntry.query = 'www.' + rid + '.com';
				queries.push(nextEntry);
			}
		}

		queries.push(entry);
		storage.setItemSync(entry.site, queries);
	}

	// Setup timer to generate mock DNS query logs for Avion
	setInterval(function () {
		let queries = storage.getItemSync('Avion');
		if (queries.length > 0 && queries.length < maxAvionDnsLogs) {
			let newEntry = {};
			for (let attr in queries[0]) {
				if (queries[0].hasOwnProperty(attr)) {
					newEntry[attr] = queries[0][attr];
				}
			}
			let rid = queries[0].recordId + 1;
			newEntry.time = rid;
			newEntry.recordId = rid;
			newEntry.query = 'avion' + rid + '.com';
			queries.push(newEntry);

			queries.sort(function (a, b) {
				return b.time - a.time;
			});

			storage.setItemSync('Avion', queries);
		}
	}, 1000);
}

function getSiteById(siteId) {
	return _.find(customerSites, function (o) {
		return o.siteId === siteId;
	});
}


function getQueryLogs(req) {
	let key = 0;
	let batchSize = 100; // Default
	if (req.query.key) {
		key = req.query.key;
	}
	if (req.query.batchSize) {
		batchSize = req.query.batchSize;
	}
	let result = [];
	if (req.query.order == 'DESC') {
		let queries = storage.getItemSync(req.query.siteName);
		if (queries) {
			console.log('queries.length:', queries.length);
			for (let k = 0; k < queries.length; k++) {
				if (result.length >= batchSize) {
					break;
				}
				if (key === 0 || key > queries[k].recordId) {
					result.push(queries[k]);
				}
			}
		}
	} else if (req.query.order == 'ASC') {
		if (key > 0) {
			let queries = storage.getItemSync(req.query.siteName);
			if (queries) {
				console.log('queries.length:', queries.length);
				for (let k = queries.length - 1, n = 0; k >= 0; k--, n++) {
					if (result.length >= batchSize) {
						break;
					}
					if (key < queries[k].recordId) {
						result.push(queries[k]);
					}
				}
				result.sort(function (a, b) {
					return b.time - a.time;
				});
			}
		}
	}
	return result;
}

router.get('/sitesAndSiteGroups/search', function (req,res) {
	let input = req.query.nameContains;
	let desiredCount = req.query.desiredResultCount;

	let payload = [];
	for (let x of customerSites) {
		if (x['siteName'].toLowerCase()
			.includes(input.toLowerCase())) {
			payload.push({
				'name': x['siteName'],
				'id': x['siteId'],
				'type': 'site'
			});
		}
	}

	for (let x of customerSiteGroups) {
		if (x['name'].toLowerCase()
			.includes(input.toLowerCase())) {
			payload.push({
				'name': x['name'],
				'id': x['siteGroupId'],
				'type': 'siteGroup'
			});
		}
	}

	payload.sort( function( a,b ) {
		return naturalCompare(a.name.toLowerCase(), b.name.toLowerCase());
	});

	payload = _.slice(payload, 0, desiredCount);

	console.log('GET ' + req.url + ' returns ' + payload.length + ' sites or sitegroups');

	setTimeout(function () {
		res.status(200)
			.send(payload);
	}, 0);
});

router.get('/sites', function (req, res) {
	console.log('GET ' + req.url + ' returns ' + customerSites.length + ' sites');

	setTimeout(function () {
		let sites = _.cloneDeep(customerSites);

		sites.forEach(function (site) {
			Object.assign(site, {
				image: spig.getImageStatusForSite(site['siteId'])
			});
		});

		res.status(200)
			.send(sites);
	}, 1000);
});

router.get('/sites/search', function (req, res) {
	let input = req.query.siteNameContains;
	let desiredCount = req.query.desiredResultCount;

	let payload = [];
	for (let x of customerSites) {
		if (x['siteName'].toLowerCase()
			.includes(input.toLowerCase())) {
			payload.push({
				'siteName': x['siteName'],
				'siteId': x['siteId']
			});
		}
	}
	payload = _.slice(payload, 0, desiredCount);
	console.log('GET ' + req.url + ' returns ' + payload.length + ' sites');

	setTimeout(function () {
		res.status(200)
			.send(payload);
	}, 0);
});

router.get('/sites/get', function (req, res) {
	let input = req.query.siteName;

	if (input === 'errorSite' || input === 'invalid' || input === 'missing') {
		res.status(500)
			.send('error site');
	} else {
		res.status(200)
			.send('{}');
	}
});

router.post('/sites/create', function (req, res) {
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));

	if ((req.body['siteName'] === undefined || req.body['siteName'].length === 0 || req.body['siteName'].length > 128) ||
		(req.body['location'] === undefined || req.body.location['lat'] === undefined || req.body.location['lng'] === undefined)) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "INPUT_VALIDATION_ERROR",
					"brief": "Provided Input is invalid."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
	} else {
		let newSite = {
			'siteName': req.body['siteName'],
			'siteId': uuidV4(),
			'location': {
				lat: req.body.location.lat,
				lng: req.body.location.lng
			}
		};

		// dup check
		if (_.findIndex(customerSites, function (o) {
				return newSite.siteName === o.siteName;
			}) !== -1) {
			setTimeout(function () {
				res.status(500)
					.send({
						"code": "DUPLICATE_SITE_ERROR",
						"brief": "Site already exists with provided name."
					});
			}, Math.floor((Math.random() * 2) + 1) * 1000);
			return;
		}


		if (req.body.settings.servers[0].ipAddress !== "") {
			newSite['dnsSettings'] = {
				source: "SITE",
				settings: {
					servers: [{
						ipAddress: req.body.dnsSettings.settings.servers[0].ipAddress
					}]
				}
			};
		} else {
			newSite['dnsSettings'] = {
				source: "GLOBAL",
				settings: {
					servers: [{
						ipAddress: "8.8.8.8"
					}]
				}
			};
		}

		customerSites.push(newSite);

		setTimeout(function () {
			res.status(200)
				.send(newSite);
		}, 1000);
	}
});

router.post('/sites/update', function (req, res) {
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));

	for (var i = 0; i < customerSites.length; i++) {
		if (customerSites[i].siteName === req.body.siteName) {
			if (req.body.settings.servers.length === 0) {
				// handle request to set site settings back to the global default
				customerSites[i].dnsSettings.source = 'GLOBAL';
				customerSites[i].dnsSettings.settings.servers[0].ipAddress = '8.8.8.8';
			} else {
				// handle request to set site settings to some particular value
				customerSites[i].dnsSettings.source = 'SITE';
				customerSites[i].dnsSettings.settings = req.body.settings;
			}
			setTimeout(function () {
				res.status(200)
					.send('');
			}, 1000);
			return;
		}
	}

	setTimeout(function () {
		res.status(500)
			.send('No site with that name');
	}, 1000);
});

router.post('/siteGroups/create', function (req, res) {
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));

	let newSiteGroup = {
		'name': req.body['name'],
		'description': req.body['description'],
		'siteIds': req.body['siteIds'],
		'siteGroupId': uuidV4()
	};


	// dup check
	if (_.findIndex(customerSiteGroups, function (o) {
			return newSiteGroup.name === o.name;
		}) !== -1) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "ERROR_DUPLICATE_SITEGROUP",
					"brief": "An existing site group with the same name exists."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}

	// site ids valid
	let badSiteId = 1;
	if (_.findIndex(newSiteGroup.siteIds, function (o) {
			if (getSiteById(o) === undefined) {
				badSiteId = o;
				return true;
			}
		}) !== -1) {
		let message = "The site '" + badSiteId + "' is not valid";
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "ERROR_INVALID_SITE",
					"brief": message
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}

	customerSiteGroups.push(newSiteGroup);

	setTimeout(function () {
		res.status(200)
			.send(newSiteGroup);
	}, Math.floor((Math.random() * 2) + 1) * 1000);
});

router.get('/siteGroups', function (req, res) {
	console.log('GET ' + req.url + ':' + JSON.stringify(req.body));
	let input = req.query.siteId;

	let payload = [];
	if (input !== undefined) {
		let foundIndex = _.findIndex(customerSiteGroups, function (o) {
			let siteIds = o.siteIds;
			for (let x of siteIds) {
				if (x === input) {
					return true;
				}
			}
		});
		if (foundIndex != -1) {
			payload.push(customerSiteGroups[foundIndex]);
			res.status(200)
				.send(payload);
			return;
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.status(500)
				.send(JSON.stringify({
					code: "GET_SITE_GROUPS_ERROR",
					brief: "Failed to list site groups."
				}));
			return;
		}
	}
	setTimeout(function () {
		res.status(200)
			.send(customerSiteGroups);
	}, Math.floor((Math.random() * 4) + 1) * 1000);
});

router.get('/siteGroups/search', function (req, res) {
	let input = req.query.siteGroupNameContains;
	let desiredCount = req.query.desiredResultCount;

	let payload = [];
	for (let x of customerSiteGroups) {
		if (x['name'].toLowerCase()
			.includes(input.toLowerCase())) {
			payload.push({
				'name': x['name'],
				'siteGroupId': x['siteGroupId']
			});
		}
	}
	payload = _.slice(payload, 0, desiredCount);
	console.log('GET ' + req.url + ' returns ' + payload.length + ' site groups');

	setTimeout(function () {
		res.status(200)
			.send(payload);
	}, 0);
});

router.post('/siteGroups/:siteGroupId/delete', function (req, res) {
	console.log('POST' + req.url + ':' + JSON.stringify(req.body));

	var siteGroupId = req.params.siteGroupId;
	let foundIndex = _.findIndex(customerSiteGroups, function (o) {
		return siteGroupId === o.siteGroupId;
	});
	if (foundIndex !== -1) {
		customerSiteGroups.splice(foundIndex, 1);
	} else {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "ERROR_SITE_GROUP_NOT_FOUND",
					"brief": "No site group exists with given site group id."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}
	setTimeout(function () {
		res.status(200)
			.send();
	}, Math.floor((Math.random() * 2) + 1) * 1000);
});

router.post('/siteGroups/:siteGroupId/update', function (req, res) {
	console.log('POST' + req.url + ':' + JSON.stringify(req.body));
	let siteGroupId = req.params.siteGroupId;
	let name = req.body['name'];
	let description = req.body['description'];
	let siteIds = req.body['siteIds'];

	let foundIndex = _.findIndex(customerSiteGroups, function (o) {
		return siteGroupId === o.siteGroupId;
	});
	if (foundIndex !== -1) {
		if (name !== undefined) {
			if (name.length === 0 || name.length >= 128) {
				res.setHeader('Content-Type', 'application/json');
				res.status(500)
					.send(
						JSON.stringify({
							"code": "ERROR_SITEGROUP_NAME_LENGTH",
							"brief": "The input site group name exceeds the maximum length."
						}));
				return;
			}
			customerSiteGroups[foundIndex]['name'] = name;
		}
		if (description !== undefined) {
			if (description.length === 0 || description.length > 128) {
				res.setHeader('Content-Type', 'application/json');
				res.status(500)
					.send(
						JSON.stringify({
							"code": "ERROR_SITEGROUP_DESCRIPTION_LENGTH",
							"brief": "The input site group description exceeds the maximum length."
						}));
				res.status(500)
					.send();
				return;
			}
			customerSiteGroups[foundIndex]['description'] = description;
		}
		if (siteIds !== undefined) {
			customerSiteGroups[foundIndex]['siteIds'] = siteIds;
		}
	} else {
		res.status(500)
			.send();
		return;
	}
	res.status(200)
		.send();
});

router.get('/dnsquerylog', function (req, res) {
	setTimeout(function () {
		let dnsQueries = getQueryLogs(req);
		console.log('GET ' + req.url + ' returns ' + dnsQueries.length + ' DNS queries');
		res.status(200)
			.send(dnsQueries);
	}, delay);
});

module.exports = {
	router: router,
	initMocData: initMocData
};
