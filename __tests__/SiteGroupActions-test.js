jest.dontMock('../src/scripts/actions/SiteGroupActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;
const AppConstants = require('../src/scripts/constants/AppConstants')
	.default;

const deferred = require('../__testutils__/deferred.js')
	.default;

describe('SiteGroup Actions', () => {
	let appDispatcher;
	let ToastActions;
	let sut;
	let SiteGroupService;
	let PolicyService;
	var mockResponse = ['WhatWhat?'];
	var TimerActions;
	let deferred;
	var getAllSiteGroupsPromise;


	beforeEach(() => {
		deferred = require('../__testutils__/deferred')
			.default;
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		SiteGroupService = require('../src/scripts/services/SiteGroupService')
			.default;
		PolicyService = require('../src/scripts/services/PolicyService')
			.default;
		TimerActions = require('../src/scripts/actions/TimerActions')
			.default;
		sut = require('../src/scripts/actions/SiteGroupActions')
			.default;
		ToastActions = require('../src/scripts/actions/ToastActions')
			.default;

		getAllSiteGroupsPromise = deferred();
		SiteGroupService.getAll.mockReturnValue(getAllSiteGroupsPromise.promise);
	});

	it('should call dispatch OVERLAY_CHANGE_VIEW when close is invoked ', () => {
		sut.close();
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
				viewName: ''
			});

	});

	it('should call SiteGroupService updateSiteGroup when updateSiteGroup is invoked', () => {

		let fullSiteGroup = {
			name: 'ChicagoSite123',
			description: 'description of ChicagoSite123',
			siteIds: ['f23-d123d-fde1', 'at7-b143d-64e1'],
		};

		let updateSiteGroupsPromise = deferred();
		SiteGroupService.updateSiteGroup.mockReturnValue(updateSiteGroupsPromise.promise);

		sut.updateSiteGroup('1', fullSiteGroup);

		expect(SiteGroupService.updateSiteGroup)
			.toBeCalledWith('1', fullSiteGroup);

		return updateSiteGroupsPromise.resolveThen(mockResponse, () => {
			expect(appDispatcher.dispatch)
				.toBeCalledWith({
					actionType: ActionTypes.SITEGROUPS_UPDATE,
					siteGroupId: '1',
					siteGroup: fullSiteGroup
				});
		});
	});


	it('should call SiteGroupService createSiteGroup when createSiteGroup is invoked ', () => {

		var siteGroup = {
			siteGroupId: 1,
			name: 'ChicagoSite123',
			description: 'description of ChicagoSite123',
			siteIds: ['f23-d123d-fde1', 'at7-b143d-64e1']
		};

		let policies = [];

		let createSiteGroupsPromise = deferred();
		let getPoliciesForSiteGroup = deferred();
		SiteGroupService.createSiteGroup.mockReturnValue(createSiteGroupsPromise.promise);
		PolicyService.getPoliciesForSiteGroup.mockReturnValue(getPoliciesForSiteGroup.promise);

		sut.createSiteGroup(siteGroup);

		expect(SiteGroupService.createSiteGroup)
			.toBeCalledWith(siteGroup);

		return createSiteGroupsPromise.resolveThen(siteGroup, () => {
			expect(appDispatcher.dispatch)
				.toBeCalledWith({
					siteGroup: siteGroup,
					actionType: ActionTypes.SITEGROUPS_CREATE
				});
			getPoliciesForSiteGroup.resolveThen(mockResponse, () => {
				expect(appDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.SITEGROUPS_POLICY_RETURN,
						policies: policies,
						siteGroupId: siteGroup.siteGroupId
					});
			});
		});
	});

	it('should call SiteGroupService deleteSiteGroup when deleteSiteGroup is invoked ', () => {
		const siteGroupId = 'y2a-ao2pd-82c1-1c23';

		SiteGroupService.deleteSiteGroup.mockReturnValue(Promise.resolve(''));

		return sut.deleteSiteGroup(siteGroupId)
			.then(() => {
				expect(appDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.SITEGROUPS_DELETE,
						siteGroupId: siteGroupId
					});
			});
	});

	it('should call toast when CAPI fails to return site group list', () => {
		sut.getAll();
		return getAllSiteGroupsPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalledWith('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
		});
	});
});
