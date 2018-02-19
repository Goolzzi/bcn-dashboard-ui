// File location: __tests__/app/App-test.js
jest.dontMock('../src/scripts/router/routes/Login/components/Login');
jest.dontMock('../src/scripts/router/routes/Login/components/render.jsx');
jest.dontMock('../src/scripts/dispatchers/AppDispatcher');
jest.dontMock('../src/scripts/components/Toast/Toast');
jest.dontMock('../src/scripts/components/Toast/render.jsx');
jest.dontMock('../src/scripts/stores/Toaster');
jest.dontMock('../src/scripts/constants/AppConstants');

describe('Login Test', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	let Toast = require('../src/scripts/components/Toast/Toast')
		.default
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let Login = require('../src/scripts/router/routes/Login/components/Login')
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

	var sut, loginPromise;
	var element, usernameNode, passwordNode, submitNode;
	beforeEach(function () {

		ToastActions.toastSettings = jest.genMockFunction();
		ToastActions.toast = jest.genMockFunction();
		ToastActions.removeAll = jest.genMockFunction();

		// Render the element
		sut = ReactTestUtils.renderIntoDocument( <
			Login / >
		);

		// Mock the router push call so we can verify it's being called.
		sut.context.router = {
			push: jest.genMockFunction()
		};

		loginPromise = deferred();
		AuthActions.login.mockReturnValue(loginPromise.promise);

		element = ReactDOM.findDOMNode(sut);
		usernameNode = element.querySelector('*[data-bcn-id="input-email"]');
		passwordNode = element.querySelector('*[data-bcn-id="input-password"]');
		submitNode = element.querySelector('*[data-bcn-id="btn-login"]');
	});


	var submitLogin = (username, password) => {

		usernameNode.value = username;
		passwordNode.value = password;

		ReactTestUtils.Simulate.click(submitNode);

		// Ensure authentication action is called
		expect(AuthActions.login)
			.toBeCalledWith(username, password);
	}

	it('should include required bcn-id tags', function () {
		var element = ReactDOM.findDOMNode(sut);

		// Elements used by UAT's to drive selenium tests
		expect(element.querySelector('*[data-bcn-id="btn-login"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-email"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-password"]'))
			.not.toBeNull();
	});

	it('should call login action and disable input until login complete ', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		// Ensure inputs are disabled while waiting for response
		expect(usernameNode.disabled)
			.toEqual(true);
		expect(passwordNode.disabled)
			.toEqual(true);
		expect(submitNode.disabled)
			.toEqual(true);

		// call always response callback
		return loginPromise.resolveThen(undefined, () => {

			// Don't ensure the inputs are re-enabled
			// because why would you want your login inputs to be
			// enabled when you've just successfully logged in?
			// this was causing an error to appear in the browser.
			//expect(usernameNode.disabled)
			//	.toEqual(false);
			//expect(passwordNode.disabled)
			//	.toEqual(false);
			//expect(submitNode.disabled)
			//	.toEqual(false);
		});
	});

	it('should re-enable input when error toast is displayed', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		var failureResponse = {
			responseText: '{"code": "INVALID_CREDENTIALS"}'
		};

		return loginPromise.rejectThen(failureResponse, () => {
			// Ensure the inputs are re-enabled
			expect(usernameNode.disabled)
				.toEqual(false);
			expect(passwordNode.disabled)
				.toEqual(false);
			expect(submitNode.disabled)
				.toEqual(false);
		});
	});

	it('should fire toast action due to credentials login failure with invalid credential text', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		var failureResponse = {
			responseText: '{"code": "INVALID_CREDENTIALS"}'
		};

		return loginPromise.rejectThen(failureResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith('error', 'Invalid credentials.  Please try again.');
		});
	});

	it('should fire toast action due to server login failure with server error text', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		var expectedErrorText = 'Server error. Please contact your administrator.';
		var expectedErrorType = 'error';

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "SERVER_ERROR"}'
		};
		return loginPromise.rejectThen(failureResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith(expectedErrorType, expectedErrorText);
		});
	});

	it('should fire toast action due to server login failure with improperly formed error', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		var expectedErrorText = 'Server error. Please contact your administrator.';
		var expectedErrorType = 'error';

		// Improperly formed error
		var failureResponse = {};
		return loginPromise.rejectThen(failureResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith(expectedErrorType, expectedErrorText);
		});
	});

	it('should fire toast action due to server login failure with improperly formed error', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		var expectedErrorText = 'Server error. Please contact your administrator.';
		var expectedErrorType = 'error';

		// Improperly formed error
		var failureResponse = {
			responseText: '{"code": "SERVER_'
		};
		return loginPromise.rejectThen(failureResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith(expectedErrorType, expectedErrorText);
		});
	});

	it('should clear any existing toast when login is executed', function () {

		submitLogin('bluecat@bluecat.com', 'password');

		var expectedErrorText = 'Server error. Please contact your administrator.';
		var expectedErrorType = 'error';

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "SERVER_ERROR"}'
		};
		return loginPromise.rejectThen(failureResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith(expectedErrorType, expectedErrorText);

			submitLogin('bluecat@bluecat.com', 'password');

			expect(ToastActions.removeAll)
				.toBeCalled();
		});
	});

	it('redirect to /forgotPassword screen when clicked on "forgot password" link', function () {

		var forgotPassword = element.querySelector('a.forgot-password');
		ReactTestUtils.Simulate.click(forgotPassword);

		expect(forgotPassword)
			.not.toBeNull();

		expect(sut.context.router.push)
			.toBeCalledWith(AppConstants.FORGOT_PASSWORD);
	});

});
