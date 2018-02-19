'use strict'
jest.dontMock('events');
jest.dontMock('object-assign');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('../src/scripts/stores/SiteSummaryStore');
jest.dontMock('lodash');

describe('SiteSummaryStore', function () {

	var createSite = (siteName, lat, lng) => {
		return {
			'siteId': siteName,
			'siteName': siteName,
			'location': {
				'lat': lat,
				'lng': lng
			}
		}
	};

	let testSites = [createSite('siteA', '1.0', '1.0'),
                     createSite('siteB', '2.0', '1.0'),
                     createSite('siteC', '3.0', '1.0'),
                     createSite('siteD', '4.0', '1.0'),
                     createSite('siteE', '5.0', '1.0'),
                     createSite('siteF', '5.0', '1.0')];

	const ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	let sut, mockSiteChangeListener, callback;
	let AppDispatcher;
	beforeEach(function () {
		//mock the app dispatcher
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		sut = require('../src/scripts/stores/SiteSummaryStore')
			.default;

		callback = AppDispatcher.register.mock.calls[0][0];
		mockSiteChangeListener = jest.genMockFunction();
		sut.addChangeListener(mockSiteChangeListener);
	});

	afterEach(function () {
		sut.removeChangeListener(mockSiteChangeListener);
	});

	it('get should return empty array', function () {
		expect(sut.get())
			.toEqual([]);
	});


	it('should call call registered listener when site information changes is called', function () {

        expect(mockSiteChangeListener).toHaveBeenCalledTimes(0);

		callback({
			actionType: ActionTypes.SITES_SUMMARY_SET,
			sites_summary: [testSites[5], testSites[2], testSites[3]]
		});

		expect(mockSiteChangeListener).toHaveBeenCalledTimes(1);

	});


	it('should call this.removeListener when removeChangeListener is called', function () {

    	sut.removeChangeListener(mockSiteChangeListener);

        expect(mockSiteChangeListener).toHaveBeenCalledTimes(0);

		callback({
			actionType: ActionTypes.SITES_SUMMARY_SET,
			sites_summary: [testSites[5], testSites[2], testSites[3]]
		});

		expect(mockSiteChangeListener).toHaveBeenCalledTimes(0);
	});


	it('should update stored sites when SITES_SET is dispatched', function () {
		callback({
			actionType: ActionTypes.SITES_SUMMARY_SET,
			sites_summary: [testSites[4], testSites[1], testSites[3], testSites[2]]
		});

		expect(sut.get())
			.toEqual([testSites[4], testSites[1], testSites[3], testSites[2]]);
	});



	it('should get sites by ID', function () {
        callback({
			actionType: ActionTypes.SITES_SUMMARY_SET,
			sites_summary: [testSites[4], testSites[1], testSites[3], testSites[2]]
		});

		expect(sut.getById('siteE'))
			.toEqual(testSites[4]);

		expect(sut.getById('siteAABD'))
			.toEqual(null);
	});


	it('should do nothing when unrelated action is dispatched', function () {

		callback({
			actionType: 'test'
		});

		expect(sut.get())
			.toEqual([]);
		expect(mockSiteChangeListener)
			.not.toBeCalled();

	});

	it('should not be initialized at startup', function () {
		expect(sut.getInitialized())
			.toEqual(false);
	});

	it('should be initialized after sites are loaded', function () {
		callback({
			actionType: ActionTypes.SITES_SUMMARY_SET,
			sites_summary: [testSites[4], testSites[1], testSites[3], testSites[2]]
		});
		expect(sut.getInitialized())
			.toEqual(true);
	});

});
