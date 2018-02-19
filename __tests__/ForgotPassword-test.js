// File location: __tests__/app/App-test.js
jest.dontMock('../src/scripts/router/routes/ForgotPassword/components/ForgotPassword');
jest.dontMock('../src/scripts/router/routes/ForgotPassword/components/render.jsx');
jest.dontMock('../src/scripts/dispatchers/AppDispatcher');
jest.dontMock('../src/scripts/components/Toast/Toast');
jest.dontMock('../src/scripts/components/Toast/render.jsx');
jest.dontMock('../src/scripts/stores/Toaster');
jest.dontMock('../src/scripts/constants/AppConstants');

describe('ForgotPassword Test', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	let Toast = require('../src/scripts/components/Toast/Toast')
		.default
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let ForgotPassword = require('../src/scripts/router/routes/ForgotPassword/components/ForgotPassword')
		.default
	let AuthActions = require('../src/scripts/actions/AuthActions')
		.default;
	let AppConstants = require('../src/scripts/constants/AppConstants')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut, resetRequestPromise;
	var element, emailField, submitButton;

	beforeEach(function () {

		ToastActions.toastSettings = jest.genMockFunction();
		ToastActions.toast = jest.genMockFunction();
		ToastActions.removeAll = jest.genMockFunction();

		// Used to set router contextType as element not rendered
		// into Router type for testing.
		ForgotPassword.contextTypes = {
			router: function () {
				return {};
			}
		};

		// Render the element
		sut = ReactTestUtils.renderIntoDocument( <
			ForgotPassword / >
		);

		// Mock the router push call so we can verify it's being called.
		sut.context.router = {
			push: jest.genMockFunction()
		};

		resetRequestPromise = deferred();
		AuthActions.resetRequest.mockReturnValue(resetRequestPromise.promise);

		element = ReactDOM.findDOMNode(sut);
		emailField = element.querySelector('*[data-bcn-id="input-email"]');
		submitButton = element.querySelector('*[data-bcn-id="btn-submit"]');
	});


	var submitForgotPassword = (email) => {

		emailField.value = email;

		ReactTestUtils.Simulate.click(submitButton);

	}

	it('should include required bcn-id tags', function () {
		var element = ReactDOM.findDOMNode(sut);

		// Elements used by UAT's to drive selenium tests
		expect(element.querySelector('*[data-bcn-id="btn-submit"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-email"]'))
			.not.toBeNull();
	});

	it('should call resetRequest action and disable input until resetRequest complete ', function () {

		submitForgotPassword('test@bluecatnetworks.com');

		expect(AuthActions.resetRequest)
			.toBeCalled();

		// Ensure inputs are disabled while waiting for response
		expect(emailField.disabled)
			.toEqual(true);
		expect(submitButton.disabled)
			.toEqual(true);

	});

	it('should re-enable input when error toast is displayed', function () {

		submitForgotPassword('test@bluecatnetworks.com');

		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};

		return resetRequestPromise.rejectThen(failureResponse, () => {
			// Ensure the inputs are re-enabled
			expect(emailField.disabled)
				.toEqual(false);
			expect(submitButton.disabled)
				.toEqual(false);
		});
	});

	it('should fire toast action when provided email do not exists', function () {

		submitForgotPassword('test@bluecatnetworks.com');

		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};

		return resetRequestPromise.rejectThen(failureResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith('error', 'Could not find user in system');
		});
	});

	it('should fire toast action an invalid email address is provided', function () {

		submitForgotPassword('invalidemail');

		expect(ToastActions.toast)
			.toBeCalledWith('error', 'Please provide valid email address');
	});

	it('should clear any existing toast when forgotPassword is executed', function () {

		submitForgotPassword('test@bluecatnetworks.com');

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};
		return resetRequestPromise.rejectThen(failureResponse, () => {

			expect(ToastActions.toast)
				.toBeCalledWith('error', 'Could not find user in system');

			submitForgotPassword('test@bluecatnetworks.com');

			expect(ToastActions.removeAll)
				.toBeCalled();
		});
	});

	// it('should show spinner when request is in process', function () {

	// 	submitForgotPassword('test@bluecatnetworks.com');

	// 	return resetRequestPromise.rejectThen(failureResponse, () => {

	// 		expect(ToastActions.toast)
	// 			.toBeCalledWith('error', 'Could not find user in system');

	// 		submitForgotPassword('test@bluecatnetworks.com');

	// 		expect(ToastActions.removeAll)
	// 			.toBeCalled();
	// 	});
	// });

	it('should display "mail sent" message when request is received successfully', function () {

		submitForgotPassword('test@bluecatnetworks.com');

		// Properly formed error
		var response = {
			responseText: '{"tempPassword": "329cja3982"}'
		};

		expect(sut.state.isSubmitting)
			.toBeTruthy();

		return resetRequestPromise.resolveThen(response, () => {
			expect(sut.state.isSubmitting)
				.toBeFalsy();
			expect(sut.state.isEmailSent)
				.toBeTruthy();
		});

	});

	it('should redirect to reset password screen when "mail sent" message is clicked', function () {

		submitForgotPassword('test@bluecatnetworks.com');

		// Properly formed error
		var response = {
			responseText: '{"tempPassword": "329cja3982"}'
		};

		return resetRequestPromise.resolveThen(response, () => {
			expect(sut.state.isEmailSent)
				.toBeTruthy();

			ReactTestUtils.Simulate.click(element.querySelector('.clickable'));

			expect(sut.context.router.push)
				.toBeCalledWith(AppConstants.RESET_PASSWORD)
		});

	});


	it('should redirect to login screen when logo is clicked', function () {

		ReactTestUtils.Simulate.click(element.querySelector('.logo'));

		expect(sut.context.router.push)
			.toBeCalledWith(AppConstants.LOGIN_ROUTE)

	});

});
