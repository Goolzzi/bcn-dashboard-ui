jest.dontMock('../src/scripts/actions/SiteActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;
const AppConstants = require('../src/scripts/constants/AppConstants')
	.default;

const deferred = require('../__testutils__/deferred.js')
	.default;

describe('Sites Actions', () => {
	let appDispatcher;
	let sut;
	var TimerActions;
	var siteServicePromise;
	let deferred;
	var mockResponse = ['mockery'];

	var SiteService;
	beforeEach(() => {
		deferred = require('../__testutils__/deferred')
			.default;
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		SiteService = require('../src/scripts/services/SiteService')
			.default;
		TimerActions = require('../src/scripts/actions/TimerActions')
			.default;

		sut = require('../src/scripts/actions/SiteActions')
			.default;

		siteServicePromise = deferred();
		SiteService.getAll.mockReturnValue(siteServicePromise.promise);
		SiteService.getSummary.mockReturnValue(siteServicePromise.promise);
		SiteService.search.mockReturnValue(siteServicePromise.promise);
	});

	it('should call SiteService createSite when createSite is invoked ', () => {
		var testSite = {
			'siteName': 'mysite'
		};

		SiteService.createSite.mockReturnValue(Promise.resolve(testSite));

		return sut.createSite(testSite)
			.then(() => {

			});

	});

	it('should request sites when getAll is called and dispatch SITES_SET when complete', () => {
		sut.getAllSites();
		expect(SiteService.getAll)
			.toBeCalled();
		return siteServicePromise.resolveThen(mockResponse, () => {
			expect(appDispatcher.dispatch)
				.toBeCalledWith({
					actionType: ActionTypes.SITES_SET,
					sites: mockResponse
				});
		});
	});


	it('should request sites summary when getSummary is called and dispatch SITES_SUMMARY_SET when complete', () => {
		sut.getAllSitesSummary();
		expect(SiteService.getSummary)
			.toBeCalled();
		return siteServicePromise.resolveThen(mockResponse, () => {
			expect(appDispatcher.dispatch)
				.toBeCalledWith({
					actionType: ActionTypes.SITES_SUMMARY_SET,
					sites_summary: mockResponse
				})
		});
	});

	it('should request site suggestions when getSuggestions is called and dispatch SITE_SUGGESTIONS_SET when complete', () => {
		sut.getSuggestions("test");
		expect(SiteService.search)
			.toBeCalledWith("test", 10);
		return siteServicePromise.resolveThen(mockResponse, () => {
			expect(appDispatcher.dispatch)
				.toBeCalledWith({
					actionType: ActionTypes.SITE_SUGGESTIONS_SET,
					suggestions: mockResponse
				});
		});
	});

	it('should dispatch correctly when close is called', () => {
		sut.close();
		expect(appDispatcher.dispatch)
		.toBeCalledWith({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: ''
		});
	});


});
