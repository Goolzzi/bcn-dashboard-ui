jest.dontMock('../src/scripts/actions/OverlayActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;

describe('Overlay Actions', () => {
	let appDispatcher;
	let sut;

	var SiteService;
	beforeEach(() => {
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		sut = require('../src/scripts/actions/OverlayActions')
			.default;
	});

  it('should dispatch correctly when /domainlists is entered', () => {
		sut.showDomainLists();

		expect(appDispatcher.dispatch)
		.toBeCalledWith({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: '/domainlists'
		});
	});

	it('should dispatch correctly when /sitegroups is entered', () => {
		sut.showPolicies();

		expect(appDispatcher.dispatch)
		.toBeCalledWith({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: '/policies'
		});
	});

	it('should dispatch correctly when /sites is entered', () => {
		sut.showSites();

		expect(appDispatcher.dispatch)
		.toBeCalledWith({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: '/sites'
		});
	});

	it('should dispatch correctly when /policies is entered', () => {
		sut.showSiteGroups();

		expect(appDispatcher.dispatch)
		.toBeCalledWith({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: '/sitegroups'
		});
	});
});
