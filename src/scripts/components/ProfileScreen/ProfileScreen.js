/**
 * ProfileScreen Component
 */

import React from 'react';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import ToastActions from '../../actions/ToastActions';

import './ProfileScreen.less';
import render from './render.jsx';

import LogManager from '../../logger/logger'

const LOGGER = LogManager.getLogger('ProfileScreen');

import _ from 'lodash';

/**
 * ProfileScreen Component
 */
var ProfileScreen = React.createClass({

	getInitialState: function () {

		this.stagedErrors = {};

		return {
			passwordForm: null,
			errors: {},
			user: null,
			isSubmitting: false,
			isShown: false
		};

	},

	/** Fires before component is unmounted */
	componentWillMount: function () {
		let userInfo = UserStore.getUserInfo();

		if (userInfo === false)
			UserActions.getUserInfo();
		else
			this.setState({
				user: userInfo
			});

	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		UserStore.addChangeListener(this._handleUserStoreChange);
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		UserStore.removeChangeListener(this._handleUserStoreChange);
	},

	/** Executed when there is a change in UserStore */
	_handleUserStoreChange: function () {
		let userInfo = UserStore.getUserInfo();
		let isShown = UserStore.isProfilePanelShown();
		this.setState({
			user: userInfo,
			isShown: isShown
		});
	},

	/**
	 * Closes the Profile screen, Invoked when user clicked on the X button or < button
	 */
	_handleOverlayClose: function () {
		UserActions.hideProfile();
	},

	/**
	 * Inoked when update link is clicked to open the password change form
	 * @return {[type]} [description]
	 */
	_handlePasswordUpdate: function () {
		this.setState({
			passwordForm: {
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
				errors: {},
			}
		});
	},

	/**
	 * Invoked when cancel link is clicked on password change form
	 */
	_handlePasswordFormCancel: function () {
		this.setState({
			passwordForm: null
		});
	},

	/**
	 * Validates form inputs and staged errors if any
	 * @return {Boolean} True if form is ready to be submitted
	 */
	isFormReady: function () {

		if (this.state.passwordForm === null)
			return false;

		let passwordForm = this.state.passwordForm;

		if (!this.validateCurrentPassword()) {
			return false;
		} else if (_.isEmpty(passwordForm.newPassword)) {
			this.stagedErrors.newPassword = 'This field is required.';
			return false;
		} else if (!_.isEqual(passwordForm.newPassword, passwordForm.confirmNewPassword)) {
			this.stagedErrors.confirmNewPassword = 'New Passwords do not match';
			return false;
		}

		this.stagedErrors = {};
		return true;
	},

	/**
	 * Validates the form and display staged errors if any
	 * @return {Boolean} True if form is ready to be submitted
	 */
	isValid: function () {

		if (this.state.passwordForm === null)
			return false;

		let isValid = this.isFormReady();
		let passwordForm = this.state.passwordForm;
		passwordForm.errors = this.stagedErrors;
		this.setState({
			passwordForm: passwordForm
		});

		return isValid;
	},

	/**
	 * Validates the temporary generated password from UserStore, Staged error if validation fails
	 * @return {Boolean} True if correct password is specified
	 */
	validateCurrentPassword: function () {
		const isValid = UserStore.validatePassword(this.state.passwordForm.currentPassword);

		if (!isValid)
			this.stagedErrors.currentPassword = 'WHOOPS, PLEASE VERIFY YOUR CURRENT PASSWORD';
		else
			this.stagedErrors.currentPassword = '';

		return isValid;
	},

	/**
	 * Handles reset password form submission
	 */
	_handleSubmit: function () {

		if (this.isValid()) {

			ToastActions.removeAll();

			this.setState({
				errors: {},
				isSubmitting: true
			});

			UserActions.updatePassword({
					emailAddress: UserStore.getEmail(),
					password: this.state.passwordForm.currentPassword,
					new_pw: this.state.passwordForm.newPassword
				})
				.then(function (i) {

					ToastActions.toast('info', 'Please log back in with your new password');
					LOGGER.logError('ProfileScreen', 'updatePassword success');
					this.setState({
						isSubmitting: false
					})

				}.bind(this))
				.catch(function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR, textStatus, errorThrown);
					LOGGER.logError('ProfileScreen', 'updatePassword failed');
					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							ToastActions.toast('error', responseObject.brief);
						}
					} catch (err) {
						// noop
						LOGGER.logError('ProfileScreen', 'updatePassword failed unable to process updatePassword response');
					}

					this.setState({
						isSubmitting: false
					})

				}.bind(this));
		} else {
			ToastActions.toast('error', 'Please complete all password information before saving.');
		}
	},

	/**
	 * Updates and validates the input fields, displays error if any
	 * @param  e {Event} Input box change event
	 */
	_handleFieldValueChange: function (e) {

		let passwordForm = this.state.passwordForm;
		passwordForm[e.target.name] = e.target.value;


		if (e.target.name === 'confirmNewPassword') {

			if (passwordForm.newPassword !== e.target.value) {
				passwordForm.errors.confirmNewPassword = 'New Passwords do not match';
			} else {
				passwordForm.errors.confirmNewPassword = '';
			}
		} else if (e.target.name === 'currentPassword') {
			this.validateCurrentPassword();
			passwordForm.errors.currentPassword = this.stagedErrors.currentPassword;
		} else if (e.target.name === 'newPassword') {
			if (!_.isEmpty(passwordForm.confirmNewPassword)) {
				if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
					passwordForm.errors.confirmNewPassword = 'New Passwords do not match';
				} else {
					passwordForm.errors.confirmNewPassword = '';
				}
			}
		}

		this.setState({
			passwordForm
		});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {

		return render.ProfileScreen.call(this);
	}
});
export default ProfileScreen;
