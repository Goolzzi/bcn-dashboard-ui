'use strict'
jest.dontMock('events');
jest.dontMock('object-assign');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('../src/scripts/stores/SiteStore');
jest.dontMock('lodash');

describe('SiteStore', function () {

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
	let sut;
	let callback;
	let mockSiteChangeListener, mockSuggestionChangeListener;
	let AppDispatcher;
	beforeEach(function () {
		//mock the app dispatcher
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		sut = require('../src/scripts/stores/SiteStore')
			.default;
		callback = AppDispatcher.register.mock.calls[0][0];
		mockSiteChangeListener = jest.genMockFunction();
		mockSuggestionChangeListener = jest.genMockFunction();
		sut.addChangeListener(mockSiteChangeListener);
		sut.addSuggestionsChangeListener(mockSuggestionChangeListener);
	});

	afterEach(function () {
		sut.removeChangeListener(mockSiteChangeListener);
		sut.removeSuggestionsChangeListener(mockSuggestionChangeListener);
	});

	it('get should return empty array', function () {
		expect(sut.get())
			.toEqual([]);
	});

	it('getSuggestions should return empty array', function () {
		expect(sut.getSuggestions())
			.toEqual([]);
	});

	it('should call call registered listener when site information changes is called', function () {

		callback({
			actionType: ActionTypes.SITES_SET,
			sites: [testSites[5], testSites[2], testSites[3]]
		});

		expect(mockSiteChangeListener).toHaveBeenCalledTimes(1);

		callback({
			actionType: ActionTypes.SITES_ADD,
			sites: testSites[4]
		});

		expect(mockSiteChangeListener).toHaveBeenCalledTimes(2);

		callback({
			actionType: ActionTypes.SITES_UNSET,
			sites: testSites[4]
		});

		expect(mockSiteChangeListener).toHaveBeenCalledTimes(3);

	});

	it('should call this.on when addSuggestionsChangeListener is called', function () {
		sut.on = jest.genMockFunction();

		sut.addSuggestionsChangeListener(callback);

		expect(sut.on)
			.toBeCalledWith('suggestions-change', callback);
	});

	it('should call this.removeListener when removeChangeListener is called', function () {
		sut.removeListener = jest.genMockFunction();
		sut.removeChangeListener(callback);

		expect(sut.removeListener)
			.toBeCalledWith('sites-change', callback);
	});

	it('should call this.removeListener when removeSuggestionsChangeListener is called', function () {
		sut.removeListener = jest.genMockFunction();

		sut.removeSuggestionsChangeListener(callback);

		expect(sut.removeListener)
			.toBeCalledWith('suggestions-change', callback);
	});

	it('should update stored sites when SITES_SET is dispatched', function () {
		callback({
			actionType: ActionTypes.SITES_SET,
			sites: [testSites[4], testSites[1], testSites[3], testSites[2]]
		});

		expect(sut.get())
			.toEqual([testSites[4], testSites[1], testSites[3], testSites[2]]);
	});

	it('should update stored suggestions when SITE_SUGGESTIONS_SET is dispatched', function () {
		sut.emitSuggestionsChange = jest.genMockFunction();
		var suggestions = [{
			siteName: 'site-name'
		}];
		callback({
			actionType: ActionTypes.SITE_SUGGESTIONS_SET,
			suggestions: suggestions
		});

		expect(sut.getSuggestions())
			.toEqual(suggestions);
		expect(sut.emitSuggestionsChange)
			.toBeCalled();
	});

	it('should append the new site when sites add is called', function () {
		callback({
			actionType: ActionTypes.SITES_SET,
			sites: [testSites[5], testSites[2], testSites[3]]
		});

		callback({
			actionType: ActionTypes.SITES_ADD,
			sites: testSites[4]
		});

		expect(sut.get())
			.toEqual([testSites[5], testSites[2], testSites[3], testSites[4]]);
	});

	it('should create single sites array when SITES_ADD dispatched to empty store', function () {
		callback({
			actionType: ActionTypes.SITES_ADD,
			sites: testSites[4]
		});

		expect(sut.get())
			.toEqual([testSites[4]]);
	});

	it('should get sites by ID', function () {
		callback({
			actionType: ActionTypes.SITES_ADD,
			sites: testSites[4]
		});

		expect(sut.getById('siteE'))
			.toEqual(testSites[4]);
		expect(sut.getById('siteA'))
			.toEqual(null);
	});

	it('should remove stored sites when SITES_UNSET is dispatched', function () {
		callback({
			actionType: ActionTypes.SITES_UNSET
		});

		expect(sut.get())
			.toEqual([]);
	});

	it('should remove stored suggestions when clearSuggestions is called', function () {
		sut.emitSuggestionsChange = jest.genMockFunction();

		sut.clearSuggestions();

		expect(sut.getSuggestions())
			.toEqual([]);
		expect(sut.emitSuggestionsChange)
			.not.toBeCalled();
	});

	it('should do nothing when unrelated action is dispatched', function () {
		sut.emitSuggestionsChange = jest.genMockFunction();

		callback({
			actionType: 'test'
		});

		expect(sut.get())
			.toEqual([]);
		expect(mockSiteChangeListener)
			.not.toBeCalled();

		expect(sut.getSuggestions())
			.toEqual([]);
		expect(mockSuggestionChangeListener)
			.not.toBeCalled();

	});

	it('should not be initialized at startup', function () {
		expect(sut.getInitialized())
			.toEqual(false);
	});

	it('should be initialized after sites are loaded', function () {
		callback({
			actionType: ActionTypes.SITES_SET,
			sites: [testSites[4], testSites[1], testSites[3], testSites[2]]
		});
		expect(sut.getInitialized())
			.toEqual(true);
	});

});
