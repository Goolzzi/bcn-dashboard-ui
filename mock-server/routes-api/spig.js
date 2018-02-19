var express = require('express');
var router = express.Router();

var spig = {

	siteImages: {},

	getImageStatusForSite: function (siteId) {
		if (!this.siteImages[siteId]) {
			return {
				status: 'NOT_FOUND'
			}
		} else if (this.siteImages[siteId].status !== 'COMPLETED') {
			return {
				status: this.siteImages[siteId].status
			};
		} else {
			return {
				status: this.siteImages[siteId].status,
				link: this.siteImages[siteId].link,
				timeOfExpiry: Math.round(((this.siteImages[siteId].timeStarted + (24 * 60 * 60 * 1000))) / 1000)
			};
		}
	},

	setSiteImageComplete: function (siteId) {
		this.siteImages[siteId] = Object.assign(this.siteImages[siteId], {
			status: 'COMPLETED',
			link: 'https://localhost:3443/v2/api/spImage/download/spImage.tar'
		});
	},

	setSiteImageFailed: function (siteId) {
		this.siteImages[siteId] = Object.assign(this.siteImages[siteId], {
			status: 'FAILED'
		});
	},

	addSiteImageRequest: function (siteId) {
		this.siteImages[siteId] = {
			status: 'IN_PROGRESS',
			timeStarted: new Date()
				.getTime()
		};
	}
}

router.get('/download/spImage.tar', function (req, res) {
	console.log('link for image tar');
	var file = __dirname + '/../download/spImage.tar';
	console.log(file);
	res.download(file); // Set disposition and send it.
});

router.post('/generate', function (req, res) {
	console.log('/v2/api/spImage/generate');
	if (Math.random() < 0.3) {
		res.status(500)
			.send();
		return;
	}

	if (req.body) {
		var request = req.body;
		var siteId = request.siteId;
		console.log(request);
		console.log('image request for siteId: ' + siteId);
		spig.addSiteImageRequest(siteId);

		setTimeout(function () {
			if (Math.random() < 0.5) {
				spig.setSiteImageComplete(siteId);
			} else {
				spig.setSiteImageFailed(siteId);
			}
		}, 15000);

	}
	res.status(200)
		.send();
});

module.exports = {
	router: router,
	spig: spig
}
