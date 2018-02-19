let fakeSpin = require('../__testutils__/SpinnerTest')
	.default;

jest.setMock('../src/scripts/components/Spinner/Spinner', {
	default: fakeSpin
});
jest.dontMock('../src/scripts/router/routes/ResetPassword/components/ResetPassword');
jest.dontMock('../src/scripts/router/routes/ResetPassword/components/render.jsx');
jest.dontMock('../src/scripts/components/Common/TextFieldGroup');
jest.dontMock('../src/scripts/components/Common/render');
jest.dontMock('../src/scripts/dispatchers/AppDispatcher');
jest.dontMock('../src/scripts/components/Toast/Toast');
jest.dontMock('../src/scripts/components/Toast/render.jsx');
jest.dontMock('../src/scripts/stores/Toaster');
jest.dontMock('../src/scripts/constants/AppConstants');

jest.dontMock('lodash');
jest.dontMock('react-dom');

describe('ResetPassword Test', function () {

	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	let Toast = require('../src/scripts/components/Toast/Toast')
		.default
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let ResetPassword = require('../src/scripts/router/routes/ResetPassword/components/ResetPassword')
		.default
	let AuthActions = require('../src/scripts/actions/AuthActions')
		.default;
	let AuthStore = require('../src/scripts/stores/AuthStore')
		.default;
	let AppConstants = require('../src/scripts/constants/AppConstants')
		.default;
	let TextFieldGroup = require('../src/scripts/components/Common/TextFieldGroup')
		.default;

	let _ = require('lodash');
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut, resetPasswordPromise;
	var element, tempPasswordField, newPasswordField, confirmNewPasswordField, submitButton;

	beforeEach(function () {
		jest.resetAllMocks();
		ToastActions.toastSettings = jest.genMockFunction();
		ToastActions.toast = jest.genMockFunction();
		ToastActions.removeAll = jest.genMockFunction();
		AuthStore.getEmail.mockReturnValue('test@bluecatnetworks.com');

		// Used to set router contextType as element not rendered
		// into Router type for testing.
		ResetPassword.contextTypes = {
			router: function () {
				return {};
			}
		};

		// Render the element
		sut = ReactTestUtils.renderIntoDocument( <ResetPassword /> );

		// Mock the router push call so we can verify it's being called.
		sut.context.router = {
			push: jest.genMockFunction()
		};

		resetPasswordPromise = deferred();
		AuthActions.resetPassword.mockReturnValue(resetPasswordPromise.promise);
		AuthStore.validateTempPassword.mockImplementation(password => {
			return password === 'correct_temp_password';
		});

		element = ReactDOM.findDOMNode(sut);

		tempPasswordField = element.querySelector('*[data-bcn-id="input-temp-password"]');
		newPasswordField = element.querySelector('*[data-bcn-id="input-new-password"]');
		confirmNewPasswordField = element.querySelector('*[data-bcn-id="input-confirm-new-password"]');
		submitButton = element.querySelector('*[data-bcn-id="btn-submit"]');

	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});


	var fillResetPasswordForm = (tempPassword, newPassword, confirmNewPassword) => {

		sut.setState({
			currentPassword: tempPassword
		});

		if (newPassword)
			sut.setState({
				newPassword: newPassword
			});

		if (confirmNewPassword)
			sut.setState({
				confirmNewPassword: confirmNewPassword
			});

		submitButton = element.querySelector('*[data-bcn-id="btn-submit"]');
	};

	it('should include required bcn-id tags', function () {

		// Elements used by UAT's to drive selenium tests
		expect(element.querySelector('*[data-bcn-id="input-temp-password"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-new-password"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-confirm-new-password"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="btn-submit"]'))
			.not.toBeNull();
	});

	it('should call resetPassword action and disable input until resetPassword complete ', function () {

		AuthStore.validateTempPassword.mockReturnValue(true);
		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(ToastActions.removeAll)
			.toBeCalled();

		expect(AuthActions.resetPassword)
			.toBeCalled();

		expect(sut.state.isSubmitting)
			.toBeTruthy();

		// Ensure inputs are disabled while waiting for response
		expect(tempPasswordField.disabled)
			.toEqual(true);
		expect(newPasswordField.disabled)
			.toEqual(true);
		expect(confirmNewPasswordField.disabled)
			.toEqual(true);
		expect(element.querySelector('.btn-secondry')
				.disabled)
			.toEqual(true);

	});


	it('should verify temporary password from store and show error on failure', function () {

		AuthStore.validateTempPassword.mockReturnValue(false);
		sut.setState({
			currentPassword: 'xyz'
		});

		ReactTestUtils.Simulate.change(tempPasswordField);

		expect(AuthStore.validateTempPassword)
			.toBeCalledWith('xyz');
		expect(sut.state.errors.currentPassword)
			.toEqual('WHOOPS, PLEASE VERIFY YOUR CURRENT PASSWORD');

	});

	it('should show error until temporary password validates', function () {

		sut.setState({
			currentPassword: 'xyz'
		});
		ReactTestUtils.Simulate.change(tempPasswordField);
		sut.isValid();

		expect(AuthStore.validateTempPassword)
			.toBeCalledWith('xyz');
		expect(sut.state.errors.currentPassword)
			.toEqual('WHOOPS, PLEASE VERIFY YOUR CURRENT PASSWORD');
		// expect(element.querySelector('.form-group.has-error'))
		// 	.not.toBeNull();

		sut.setState({
			currentPassword: 'correct_temp_password'
		});
		ReactTestUtils.Simulate.change(tempPasswordField);

		expect(AuthStore.validateTempPassword)
			.toBeCalledWith('correct_temp_password');
		expect(sut.state.errors.currentPassword)
			.toEqual('');
		expect(element.querySelector('.form-group.has-error'))
			.toBeNull();

	});


	it('should display error until new password and repeat password do not match', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'incorrectrepeat');

		ReactTestUtils.Simulate.click(submitButton);

		expect(sut.state.errors.confirmNewPassword)
			.toEqual('New Passwords do not match');
		// expect(element.querySelector('.form-group.has-error'))
		// 	.not.toBeNull();

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');
		ReactTestUtils.Simulate.click(submitButton);

		expect(sut.state.errors.confirmNewPassword)
			.toBeUndefined();
		// expect(element.querySelector('.form-group.has-error'))
		// 	.toBeNull();

	});

	it('should display error when incorrect confirm password is specified', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password');

		sut.onChange({
			target: {
				value: 'incorrectrepeat',
				name: 'confirmNewPassword'
			}
		})

		expect(sut.state.errors.confirmNewPassword)
			.toEqual('New Passwords do not match');

	});

	it('should fire toast action when form is incomplete', function () {

		fillResetPasswordForm('correct_temp_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(ToastActions.toast)
			.toBeCalledWith('error', 'Please complete all new password information before saving.');
	});


	it('should clear any existing toast when form is validated', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(ToastActions.removeAll)
			.toBeCalled();
	});

	it('should call setPassword with correct params when form is submitted', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(AuthActions.resetPassword)
			.toBeCalledWith({
				emailAddress: 'test@bluecatnetworks.com',
				new_pw: 'new_password',
				temp_pw: 'correct_temp_password'
			});

	});

	it('should disable fields when setPassword request is in process', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(tempPasswordField.disabled)
			.toBeTruthy();
		expect(newPasswordField.disabled)
			.toBeTruthy();
		expect(confirmNewPasswordField.disabled)
			.toBeTruthy();
		expect(element.querySelector('*[data-bcn-id="btn-submit"]')
				.disabled)
			.toBeTruthy();
		expect(sut.state.isSubmitting)
			.toBeTruthy();

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};
		return resetPasswordPromise.rejectThen(failureResponse, () => {

			expect(tempPasswordField.disabled)
				.toBeFalsy();
			expect(newPasswordField.disabled)
				.toBeFalsy();
			expect(confirmNewPasswordField.disabled)
				.toBeFalsy();
			expect(submitButton.disabled)
				.toBeFalsy();
			expect(sut.state.isSubmitting)
				.toBeFalsy();

		});
	});

	it('should make submit button be active when form is ready to submit', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');

		expect(element.querySelector('.btn-secondry.active'))
			.not.toBeNull();

	});

	it('should show error when setPassword request fails', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};
		return resetPasswordPromise.rejectThen(failureResponse, () => {

			expect(ToastActions.toast)
				.toBeCalledWith('error', 'Could not find user in system');

		});
	});


	it('should display toast message when request is successfull', function () {

		fillResetPasswordForm('correct_temp_password', 'new_password', 'new_password');
		ReactTestUtils.Simulate.click(submitButton);

		// Properly formed error
		var response = {
			responseText: ''
		};

		expect(sut.state.isSubmitting)
			.toBeTruthy();

		return resetPasswordPromise.resolveThen(response, () => {

			expect(sut.context.router.push)
				.toBeCalledWith(AppConstants.LOGIN_ROUTE);

			expect(ToastActions.toast)
				.toBeCalledWith('info', 'Please log back in with your new password');
		});

	});


	it('should redirect to login screen when logo is clicked', function () {

		ReactTestUtils.Simulate.click(element.querySelector('.logo'));

		sut.redirectToLogin();
		expect(sut.context.router.push)
			.toBeCalledWith(AppConstants.LOGIN_ROUTE);

	});

	it('should redirect to dashboard if user is already logged in', function () {

		AuthStore.isAuthenticated.mockReturnValue(true);

		sut.componentWillMount();

		expect(sut.context.router.push)
			.toBeCalledWith(AppConstants.DASHBOARD_ROUTE);

	});

	it('should redirect to login with error if user\'s email address is not available', function () {

		AuthStore.getEmail.mockReturnValue(false);

		sut.componentWillMount();

		expect(sut.context.router.push)
			.toBeCalledWith(AppConstants.LOGIN_ROUTE)

		expect(ToastActions.toast)
			.toBeCalledWith('error', 'Invalid session encountered. Please try again or contact administrator');

	});

});
