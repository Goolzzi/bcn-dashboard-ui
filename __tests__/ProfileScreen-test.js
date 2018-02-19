let fakeSpin = require('../__testutils__/SpinnerTest')
	.default;

jest.setMock('../src/scripts/components/Spinner/Spinner', {
	default: fakeSpin
});
jest.dontMock('../src/scripts/components/Overlay/Overlay');
jest.dontMock('../src/scripts/components/Overlay/render');
jest.dontMock('../src/scripts/components/ProfileScreen');
jest.dontMock('../src/scripts/components/ProfileScreen/render');
jest.dontMock('../src/scripts/components/Common/TextFieldGroup');
jest.dontMock('../src/scripts/components/Common/render');
jest.dontMock('../src/scripts/dispatchers/AppDispatcher');
jest.dontMock('../src/scripts/components/Toast/Toast');
jest.dontMock('../src/scripts/components/Toast/render');
jest.dontMock('../src/scripts/stores/Toaster');
jest.dontMock('../src/scripts/constants/AppConstants');

jest.dontMock('lodash');
jest.dontMock('react-dom');

describe('ProfileScreen Test', function () {

	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	let Toast = require('../src/scripts/components/Toast/Toast')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let ProfileScreen = require('../src/scripts/components/ProfileScreen')
		.default;
	let UserActions = require('../src/scripts/actions/UserActions')
		.default;
	let UserStore = require('../src/scripts/stores/UserStore')
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

	let testUserInfo = {
		role: 'test',
		username: 'test@bluecatnetworks.com',
		email: 'test@bluecatnetworks.com',
		name: 'Test Name',
		password: 'hello'
	};

	var sut, profileScreenPromise;
	var element, currentPasswordField, newPasswordField, confirmNewPasswordField, submitButton, updatePasswordLink;

	beforeEach(function () {
		jest.resetAllMocks();
		ToastActions.toastSettings = jest.genMockFunction();
		ToastActions.toast = jest.genMockFunction();
		ToastActions.removeAll = jest.genMockFunction();
		UserStore.getEmail.mockReturnValue('test@bluecatnetworks.com');
		UserStore.getUserInfo.mockReturnValue(testUserInfo);
		UserStore.isProfilePanelShown.mockReturnValue(true);

		// Used to set router contextType as element not rendered
		// into Router type for testing.
		ProfileScreen.contextTypes = {
			router: function () {
				return {};
			}
		};

		// Render the element
		sut = ReactTestUtils.renderIntoDocument( < ProfileScreen / > );


		profileScreenPromise = deferred();
		UserActions.updatePassword.mockReturnValue(profileScreenPromise.promise);
		UserStore.validatePassword.mockImplementation(password => {
			return password === 'correct_password';
		});

		sut.setState({
			isShown: true
		});

		element = ReactDOM.findDOMNode(sut);
		updatePasswordLink = element.querySelector('*[data-bcn-id="password-update-link"]');
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});


	var fillProfileScreenForm = (currentPassword, newPassword, confirmNewPassword) => {

		expect(updatePasswordLink)
			.not.toBeNull();

		ReactTestUtils.Simulate.click(updatePasswordLink);

		currentPasswordField = element.querySelector('*[data-bcn-id="input-current-password"]');
		newPasswordField = element.querySelector('*[data-bcn-id="input-new-password"]');
		confirmNewPasswordField = element.querySelector('*[data-bcn-id="input-confirm-new-password"]');

		let passwordForm = sut.state.passwordForm;

		passwordForm.currentPassword = currentPassword;
		if (newPassword) {
			passwordForm.newPassword = newPassword;
		}

		if (confirmNewPassword)
			passwordForm.confirmNewPassword = confirmNewPassword;

		sut.setState({
			passwordForm: passwordForm
		})
		submitButton = element.querySelector('*[data-bcn-id="btn-submit"]');
	}

	it('should have correct user Info', function () {

		expect(sut.state.user)
			.not.toBeNull();
		expect(sut.state.user.role)
			.toEqual('test');
		expect(sut.state.user.username)
			.toEqual('test@bluecatnetworks.com');
		expect(sut.state.user.email)
			.toEqual('test@bluecatnetworks.com');
		expect(sut.state.user.name)
			.toEqual('Test Name');
	});

	it('should include required bcn-id tags when password change form is shown', function () {


		expect(updatePasswordLink)
			.not.toBeNull();

		ReactTestUtils.Simulate.click(updatePasswordLink);

		// Elements used by UAT's to drive selenium tests
		expect(element.querySelector('*[data-bcn-id="input-current-password"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-new-password"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="input-confirm-new-password"]'))
			.not.toBeNull();
		expect(element.querySelector('*[data-bcn-id="btn-submit"]'))
			.not.toBeNull();
	});

	it('should call updatePassword action and disable input until request is complete ', function () {

		UserActions.updatePassword.mockReturnValue(Promise.resolve(true));
		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(UserActions.updatePassword)
			.toBeCalled();

		expect(sut.state.isSubmitting)
			.toBeTruthy();

		// Ensure inputs are disabled while waiting for response
		expect(currentPasswordField.disabled)
			.toEqual(true);
		expect(newPasswordField.disabled)
			.toEqual(true);
		expect(confirmNewPasswordField.disabled)
			.toEqual(true);
		expect(submitButton.disabled)
			.toEqual(true);

	});


	it('should verify temporary password from store and show error on failure', function () {

		UserStore.validatePassword.mockReturnValue(false);
		fillProfileScreenForm('xyz');

		ReactTestUtils.Simulate.click(submitButton);

		expect(UserStore.validatePassword)
			.toBeCalledWith('xyz');
		expect(sut.state.passwordForm.errors.currentPassword)
			.toEqual('WHOOPS, PLEASE VERIFY YOUR CURRENT PASSWORD');

	});

	it('should show error until temporary password validates', function () {

		fillProfileScreenForm('xyz');

		ReactTestUtils.Simulate.click(submitButton);

		expect(UserStore.validatePassword)
			.toBeCalledWith('xyz');
		expect(sut.state.passwordForm.errors.currentPassword)
			.toEqual('WHOOPS, PLEASE VERIFY YOUR CURRENT PASSWORD');

		fillProfileScreenForm('correct_password');
		ReactTestUtils.Simulate.click(submitButton);

		expect(UserStore.validatePassword)
			.toBeCalledWith('correct_password');
		expect(sut.state.passwordForm.errors.currentPassword)
			.toEqual('');
	});


	it('should display error until new password and repeat password do not match', function () {

		fillProfileScreenForm('correct_password', 'new_password', 'incorrectrepeat');

		ReactTestUtils.Simulate.change(confirmNewPasswordField);

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('New Passwords do not match');

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.change(confirmNewPasswordField);

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('');
	});

	it('should display error until new password and repeat password do not match when first password field is changed', function () {

		fillProfileScreenForm('correct_password', 'incorrectrepeat', 'new_password');

		ReactTestUtils.Simulate.change(confirmNewPasswordField);

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('New Passwords do not match');

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.change(confirmNewPasswordField);

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('');
	});



	it('should display error until new password and repeat password do not match when first password field is changed', function () {

		fillProfileScreenForm('correct_password', 'incorrectrepeat', 'new_password');

		ReactTestUtils.Simulate.change(confirmNewPasswordField);

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('New Passwords do not match');

		sut._handleFieldValueChange({
			target: {
				value: 'new_password',
				name: 'newPassword'
			}
		});

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('');

		sut._handleFieldValueChange({
			target: {
				value: 'incorrectagain',
				name: 'newPassword'
			}
		});

		expect(sut.state.passwordForm.errors.confirmNewPassword)
			.toEqual('New Passwords do not match');

	});

	it('should display error when incorrect current password is typed', function () {

		ReactTestUtils.Simulate.click(updatePasswordLink);
		currentPasswordField = element.querySelector('*[data-bcn-id="input-current-password"]');
		ReactTestUtils.Simulate.change(currentPasswordField, {
			target: {
				value: 'incorrect',
				name: 'currentPassword'
			}
		});

		expect(sut.state.passwordForm.errors.currentPassword)
			.toEqual('WHOOPS, PLEASE VERIFY YOUR CURRENT PASSWORD');

	});

	it('should fire toast action when form is incomplete', function () {

		fillProfileScreenForm('', '', '');

		ReactTestUtils.Simulate.click(submitButton);

		expect(ToastActions.toast)
			.toBeCalledWith('error', 'Please complete all password information before saving.');
	});


	it('should clear any existing toast when form is validated', function () {

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(ToastActions.removeAll)
			.toBeCalled();
	});

	it('should call setPassword with correct params when form is submitted', function () {

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(UserActions.updatePassword)
			.toBeCalledWith({
				emailAddress: 'test@bluecatnetworks.com',
				password: 'correct_password',
				new_pw: 'new_password'
			});

	});

	it('should disable fields when setPassword request is in process', function () {

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		expect(currentPasswordField.disabled)
			.toBeTruthy();
		expect(newPasswordField.disabled)
			.toBeTruthy();
		expect(confirmNewPasswordField.disabled)
			.toBeTruthy();
		expect(submitButton.disabled)
			.toBeTruthy();
		expect(sut.state.isSubmitting)
			.toBeTruthy();

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};
		return profileScreenPromise.rejectThen(failureResponse, () => {

			expect(currentPasswordField.disabled)
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

		fillProfileScreenForm('correct_password', 'new_password', 'incorrectrepeat');

		expect(element.querySelector('.btn-secondry.active'))
			.toBeNull();

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		expect(element.querySelector('.btn-secondry.active'))
			.not.toBeNull();

	});

	it('should show error when setPassword request fails', function () {

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');

		ReactTestUtils.Simulate.click(submitButton);

		// Properly formed error
		var failureResponse = {
			responseText: '{"code": "INPUT_VALIDATION_ERROR", "brief": "Could not find user in system"}'
		};
		return profileScreenPromise.rejectThen(failureResponse, () => {

			expect(ToastActions.toast)
				.toBeCalledWith('error', 'Could not find user in system');

		});
	});


	it('should display toast message when request is successfull', function () {

		fillProfileScreenForm('correct_password', 'new_password', 'new_password');
		ReactTestUtils.Simulate.click(submitButton);

		// Properly formed error
		var response = {
			responseText: ''
		};

		expect(sut.state.isSubmitting)
			.toBeTruthy();

		return profileScreenPromise.resolveThen(response, () => {

			expect(ToastActions.toast)
				.toBeCalledWith('info', 'Please log back in with your new password');

			expect(sut.state.isSubmitting)
				.toBeFalsy();
		});

	});

	it('should invoke hideProfile action when overlay is closed', function () {

		sut._handleOverlayClose();

		expect(UserActions.hideProfile)
			.toBeCalled();

	});


	it('should close password change form when cancel is clicked', function () {

		fillProfileScreenForm('correct_password');
		ReactTestUtils.Simulate.click(element.querySelector('.link-cancel'));

		expect(sut.state.passwordForm)
			.toBeNull()

	});

	it('should open password change form and hide update link when update is clicked', function () {

		ReactTestUtils.Simulate.click(element.querySelector('*[data-bcn-id="password-update-link"]'));

		expect(sut.state.passwordForm)
			.toEqual({
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
				errors: {},
			});

		expect(element.querySelector('*[data-bcn-id="password-update-link"]'))
			.toBeNull();

	});


});
