jest.dontMock('../src/scripts/actions/DomainListActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;
const AppConstants = require('../src/scripts/constants/AppConstants')
	.default;

const deferred = require('../__testutils__/deferred.js')
	.default;

describe('Domain Actions', () => {
	let appDispatcher;
	let ToastActions;
	let sut;
	let DomainListService;
	let PolicyService;
	let domainListRequestPromise;
	let policyListRequestPromise;
	let deferred;
	var mockResponse = ['WhatWhat?'];
	var mockResponse2 = ['InThe'];


	beforeEach(() => {
		deferred = require('../__testutils__/deferred')
			.default;
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		DomainListService = require('../src/scripts/services/DomainListService')
			.default;
		PolicyService = require('../src/scripts/services/PolicyService')
			.default;
		sut = require('../src/scripts/actions/DomainListActions')
			.default;
		ToastActions = require('../src/scripts/actions/ToastActions')
			.default;
		domainListRequestPromise = deferred();
		policyListRequestPromise = deferred();
		DomainListService.getAll.mockReturnValue(domainListRequestPromise.promise);
		PolicyService.getPoliciesForDomainList.mockReturnValue(policyListRequestPromise.promise);
	});

	it('should call dispatch OVERLAY_CHANGE_VIEW when close is invoked', () => {
		sut.close();
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
				viewName: ''
			});
	});

	it('should request domain lists when getAll is called and dispatch DOMAINLISTS_SET when complete', () => {
		sut.getAll();
		expect(DomainListService.getAll)
			.toBeCalled();
		return domainListRequestPromise.resolveThen(mockResponse, () => {
			policyListRequestPromise.resolveThen(mockResponse2, () => {
				expect(appDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DOMAINLISTS_SET,
						domainLists: mockResponse
					});
				expect(appDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DOMAINLISTS_POLICY_RETURN,
						policies: []
					});
			});
		});
	});

	it('should call toast when CAPI fails to return domains list', () => {
		sut.getAll();
		return domainListRequestPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalledWith('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
		});
	});
});
