'use strict';

let uuidV4 = require('uuid/v4');
var express = require('express');
var router = express.Router();
let db = require('./db.json');
let _ = require('lodash');
let storage = require('node-persist');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

let domainNamePatterns = [];
let createDnsListResponse = "";


function initListMockData() {
	storage.initSync();
	domainNamePatterns = db.domainNamePatterns;

	var tempUploadPath = 'mock-server/download/temp';
	if (fs.existsSync(tempUploadPath)) {
		if (fs.existsSync(tempUploadPath)) {
			fs.readdirSync(tempUploadPath)
				.forEach(function (file, index) {
					var curPath = tempUploadPath + "/" + file;
					if (fs.lstatSync(curPath)
						.isDirectory()) { // recurse
						deleteFolderRecursive(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
		}
	} else {
		fs.mkdirSync(tempUploadPath);
	}
}


// /v1/list/dns GET
router.get('/dns', function (req, res) {
	const response = _.cloneDeep(domainNamePatterns);
	console.log('GET ' + req.url + ' returns ' + response.length + ' lists');
	res.setHeader('Content-Type', 'application/json');
	res.status(200)
		.send(JSON.stringify(response));
});


// /v1/list/dns CREATE
router.post('/dns', function (req, res) {
	//	res.setHeader('Content-Type', 'application/json');
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));
	let newDnsList = {
		'name': req.body.name,
		'description': req.body.description,
		'id': uuidV4(),
		'version': uuidV4(),
		'domainCount': 0
	};

	if (req.body['name'] === 'errorList') {
		res.status(500)
			.send('{"validationFailureMessages":{"dnsListName":"Thats a stupid name for a list."}}');
	} else {
		res.status(200)
			.send(newDnsList);
	}
	domainNamePatterns.push(newDnsList);
});

// /v1/list/dns/{domainListId}/delete DELETE
router.post('/dns/:domainListId/delete', function (req, res) {
	//	res.setHeader('Content-Type', 'application/json');
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));
	var domainListId = req.params.domainListId;
	let foundIndex = _.findIndex(domainNamePatterns, function (o) {
		return domainListId === o.id;
	});

	if (foundIndex !== -1) {
		domainNamePatterns.splice(foundIndex, 1);
	} else {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "LIST_DOES_NOT_EXIST",
					"brief": "List with given ID does not exist."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}
	setTimeout(function () {
		res.status(200)
			.send();
	}, Math.floor((Math.random() * 2) + 1) * 1000);
});


// /v1/list/dns/{domainListId}
router.get('/dns/:domainListId', function (req, res) {
	console.log('GET ' + req.url);
	let domainListId = req.params.domainListId;

	let domainList = _.find(domainNamePatterns, function (domainList) {
		return req.params.domainListId === domainList.id;
	});
	if (!domainList) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "LIST_DOES_NOT_EXIST",
					"brief": "List with given ID does not exist."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}

	let tempPath = 'mock-server/download/temp/' + domainListId + '.list';
	let hardPath = 'mock-server/download/' + domainListId + '.list';
	// ensures that original file is not overwritten
	// but if a new file is uploaded in session, it will be the one returned
	let listContent = '';
	if (fs.existsSync(tempPath)) {
		listContent = fs.readFileSync(tempPath);
	} else {
		listContent = fs.readFileSync(hardPath);
	}

	res.status(200)
		.send(listContent);
});

var validateDomain = function (domain) {
	var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
	return domain.match(re);
}

// /v1/list/dns/{domainListId}/attachfile
router.post('/dns/:domainListId/attachfile', function (req, res) {
	console.log('POST ' + req.url);

	let domainListId = req.params.domainListId;

	let domainList = _.find(domainNamePatterns, function (domainList) {
		return domainListId === domainList.id;
	});

	if (!domainList) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "LIST_DOES_NOT_EXIST",
					"brief": "List with given ID does not exist."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}

	var form = new formidable.IncomingForm();
	form.uploadDir = 'mock-server/download/temp';
	var filePath = '';

	form.on('error', function (err) {
		console.log('An error has occured: \n' + err);
	});

	form.parse(req, function (err, fields, files) {
		fs.renameSync(files.file.path, path.join('mock-server/download/temp', domainListId + ".list"));

		// collect file contents
		var fileContents = String(fs.readFileSync(path.join('mock-server/download/temp', domainListId + ".list")))
			.trim();

		// collect data for response
		var allDomains = fileContents.split("\n");
		var uniqueDomains = {};
		var numOfDuplicateDomains = 0;
		var numOfValidDomains = 0;
		var numOfInvalidDomains = 0;
		var errors = [];
		for (var domain in allDomains) {
			uniqueDomains[allDomains[domain]] = (uniqueDomains[allDomains[domain]] || 0) + 1;
		}

		for (var domain in uniqueDomains) {
			// small chance we have an empty new line
			if (uniqueDomains[domain] == null || uniqueDomains[domain] == '') {
				continue;
			}
			if (uniqueDomains[domain] > 1) {
				numOfDuplicateDomains++;
			}
			if (validateDomain(domain)) {
				numOfValidDomains++;
			} else {
				numOfInvalidDomains++;
				if (errors.length < 20) {
					var error = {
						'lineNumber': allDomains.indexOf(domain) + 1,
						'lineContents': domain
					};
					errors.push(error);
				}
			}
		}

		var response = {
			'numOfValidDomains': numOfValidDomains,
			'numOfInvalidDomains': numOfInvalidDomains,
			'numOfDuplicateDomains': numOfDuplicateDomains,
			'errors': errors
		};

		// update domain count for domain list
		let foundIndex = _.findIndex(domainNamePatterns, function (o) {
			return domainListId === o.id;
		});
		if (foundIndex !== -1) {
			domainNamePatterns[foundIndex]['domainCount'] = numOfValidDomains;
		}

		setTimeout(function () {
			res.status(200)
				.send(response);
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	});

});

// /v1/list/dns/{domainListId}/update
router.post('/dns/:domainListId/update', function (req, res) {
	//	res.setHeader('Content-Type', 'application/json');
	console.log('POST ' + req.url + ':' + JSON.stringify(req.body));

	let domainList = _.find(domainNamePatterns, function (domainList) {
		return req.params.domainListId === domainList.id;
	});

	if (!domainList) {
		setTimeout(function () {
			res.status(500)
				.send({
					"code": "LIST_DOES_NOT_EXIST",
					"brief": "List with given ID does not exist."
				});
		}, Math.floor((Math.random() * 2) + 1) * 1000);
		return;
	}

	if (req.body.name) {
		domainList.name = req.body.name;
	}

	if (req.body.description) {
		domainList.name = req.body.description;
	}

	res.status(200)
		.send();
});


module.exports = {
	router: router,
	initListMockData: initListMockData
};
