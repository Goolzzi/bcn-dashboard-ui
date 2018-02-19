'use strict'
jest.dontMock('../src/scripts/stores/SiteImageDownloadStore');
jest.dontMock('../src/scripts/constants/ActionTypes');

jest.dontMock('object-assign');
jest.dontMock('lodash');
jest.mock('../src/scripts/dispatchers/AppDispatcher');

describe('SettingsStore', function () {
	let _ = require('lodash');


	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	const addSiteImageRequest = (siteId) => {
		callback({
			actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUESTED,
			data: {
				siteId: siteId
			}
		});
	};

	const addSiteImageRequestSucceeded = (siteId) => {
		callback({
			actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUEST_SUCCEEDED,
			data: {
				siteId: siteId
			}
		});
	};

	const addSiteImageRequestFailed = (siteId) => {
		callback({
			actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUEST_FAILED,
			data: {
				siteId: siteId
			}
		});
	};

	const updateSites = (siteId, siteImage) => {
		callback({
			actionType: ActionTypes.SITES_SET,
			sites: [{
				siteName: 'blah',
				siteId: siteId,
				image: siteImage
			}]
		});
	};

	let callback;
	let MockDate = require('mockdate');

	var startDate = new Date();

	var sut, AppDispatcher;
	beforeEach(function () {
		//mock the app dispatcher
		sut = require('../src/scripts/stores/SiteImageDownloadStore')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');


		MockDate.set(startDate);
		callback = AppDispatcher.register.mock.calls[0][0];
		sut.emitChange = jest.genMockFunction();
	});

	it('should add site to store when SITEIMAGE_DOWNLOAD_REQUESTED processed', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		var imageSites = sut.get();
		expect(imageSites[siteId].startTime)
			.toEqual(startDate.getTime());
		expect(imageSites[siteId].state)
			.toEqual('REQUESTED');
		expect(sut.emitChange)
			.toBeCalled()
	});

	it('should not set image request to succeeded when SITEIMAGE_DOWNLOAD_REQUEST_SUCCEEDED processed for unknown site ', function () {
		var siteId = 'mySiteId';
		addSiteImageRequestSucceeded(siteId);
		var imageSites = sut.get();
		expect(_.keysIn(imageSites)
				.length)
			.toEqual(0);
		expect(sut.emitChange)
			.not.toBeCalled()
	});

	it('should set image request to succeeded when SITEIMAGE_DOWNLOAD_REQUEST_SUCCEEDED processed ', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		addSiteImageRequestSucceeded(siteId);
		var imageSites = sut.get();
		expect(imageSites[siteId].startTime)
			.toEqual(startDate.getTime());
		expect(imageSites[siteId].state)
			.toEqual('REQUEST_SUCCEEDED');
		expect(sut.emitChange)
			.toBeCalled()
	});

	it('should remove image request when SITEIMAGE_DOWNLOAD_REQUEST_FAILED processed ', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		addSiteImageRequestFailed(siteId);
		var imageSites = sut.get();
		expect(_.keysIn(imageSites)
				.length)
			.toEqual(0);
		expect(sut.emitChange)
			.toBeCalled()
	});

	it('should not remove image request in REQUESTED state when SITES_SET processed and image request in NOT_FOUND state', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		updateSites(siteId, {
			status: 'NOT_FOUND'
		});
		var imageSites = sut.get();
		expect(_.keysIn(imageSites)
				.length)
			.toEqual(1);
		expect(sut.emitChange)
			.toBeCalled()
	});

	it('should not remove image request in REQUEST_SUCCEEDED state when SITES_SET processed and image request in NOT_FOUND state', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		addSiteImageRequestSucceeded(siteId);
		updateSites(siteId, {
			status: 'NOT_FOUND'
		});
		var imageSites = sut.get();
		expect(_.keysIn(imageSites)
				.length)
			.toEqual(1);
		expect(sut.emitChange)
			.toBeCalled()
	});

	it('should remove image request when SITES_SET processed and image request in SUCCEEDED state', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		addSiteImageRequestSucceeded(siteId);
		updateSites(siteId, {
			status: 'IN_PROGRESS'
		});
		var imageSites = sut.get();
		expect(_.keysIn(imageSites)
				.length)
			.toEqual(0);
		expect(sut.emitChange)
			.toBeCalled()
	});

	it('should remove image request when SITES_SET processed and site no longer in site set', function () {
		var siteId = 'mySiteId';
		addSiteImageRequest(siteId);
		updateSites(siteId + 'a', {
			status: 'NOT_FOUND'
		});
		var imageSites = sut.get();
		expect(_.keysIn(imageSites)
				.length)
			.toEqual(0);
		expect(sut.emitChange)
			.toBeCalled()
	});

});
