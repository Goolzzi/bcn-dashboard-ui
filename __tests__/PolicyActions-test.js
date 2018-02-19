jest.dontMock('../src/scripts/actions/PolicyActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;
const AppConstants = require('../src/scripts/constants/AppConstants')
	.default;

const deferred = require('../__testutils__/deferred.js')
	.default;

describe('Policy Actions', () => {
	let appDispatcher;
	let ToastActions;
	let sut;
	let PolicyService;
	var policyRequestPromise;
	let deferred;
	var mockResponse = ['WhatWhat?'];


	beforeEach(() => {
		deferred = require('../__testutils__/deferred')
			.default;
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		PolicyService = require('../src/scripts/services/PolicyService')
			.default;
		sut = require('../src/scripts/actions/PolicyActions')
			.default;
		ToastActions = require('../src/scripts/actions/ToastActions')
			.default;
		policyRequestPromise = deferred();
		PolicyService.getAll.mockReturnValue(policyRequestPromise.promise);
	});

	it('should request policies when getAll is called and dispatch POLICES_SET when complete', () => {
		sut.getAll();
		expect(PolicyService.getAll)
			.toBeCalled();
		return policyRequestPromise.resolveThen(mockResponse, () => {
			expect(appDispatcher.dispatch)
				.toBeCalledWith({
					actionType: ActionTypes.POLICIES_SET,
					policies: mockResponse
				})
		});
	});

	it('should call toast when CAPI fails to return policy list', () => {
		sut.getAll();
		return policyRequestPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalledWith('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
		});
	});
});
