/**
 * ResetPassword Component
 */

import React from 'react';
import AuthStore from '../../../../stores/AuthStore';
import AuthActions from '../../../../actions/AuthActions';
import ToastActions from '../../../../actions/ToastActions';
import IdleActions from '../../../../actions/IdleActions';
import RefreshActions from '../../../../actions/RefreshActions';
import AppConstants from '../../../../constants/AppConstants';

import './ResetPassword.less';
import render from './render.jsx';
import LogManager from '../../../../logger/logger'

const LOGGER = LogManager.getLogger('ResetPassword');

import _ from 'lodash';

/**
 * ResetPassword Component
 */
var ResetPassword = React.createClass({

	contextTypes: {
		router: React.PropTypes.func
	},

	getInitialState: function () {

		this.stagedErrors = {};

		return {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
			errors: {},
			isSubmitting: false
		};

	},

	componentWillMount: function () {
		if (AuthStore.isAuthenticated()) {
			this.context.router.push(AppConstants.DASHBOARD_ROUTE);
		}

		if (AuthStore.getEmail() === false) {
			this.context.router.push(AppConstants.LOGIN_ROUTE);
			ToastActions.toast('error', 'Invalid session encountered. Please try again or contact administrator');
		}

		IdleActions.cancelTimer();
		RefreshActions.cancelTimer();
	},

	/** Redirect To Login Screen */
	redirectToLogin: function () {
		this.context.router.push(AppConstants.LOGIN_ROUTE);
	},

	/**
	 * Validates form inputs and staged errors if any
	 * @return {Boolean} True if form is ready to be submitted
	 */
	isFormReady: function () {

		if (!this.validateCurrentPassword()) {
			return false;
		} else if (_.isEmpty(this.state.newPassword)) {
			this.stagedErrors.newPassword = 'This field is required.';
			return false;
		} else if (!_.isEqual(this.state.newPassword, this.state.confirmNewPassword)) {
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
		const isValid = this.isFormReady();

		this.setState({
			errors: this.stagedErrors
		});

		return isValid;
	},

	/**
	 * Validates the temporary generated password from AuthStore, Staged error if validation fails
	 * @return {Boolean} True if correct password is specified
	 */
	validateCurrentPassword: function () {
		const isValid = AuthStore.validateTempPassword(this.state.currentPassword);

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

			AuthActions.resetPassword({
					emailAddress: AuthStore.getEmail(),
					temp_pw: this.state.currentPassword,
					new_pw: this.state.newPassword
				})
				.then(function (i) {

					this.context.router.push(AppConstants.LOGIN_ROUTE);
					ToastActions.toast('info', 'Please log back in with your new password');
					LOGGER.logError('ResetPassword', 'ResetPassword success');
					this.setState({
						isSubmitting: false
					});

				}.bind(this))
				.catch(function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR, textStatus, errorThrown);
					LOGGER.logError('ResetPassword', 'resetPassword failed');
					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							// this.setState({ errors: responseObject.errors, isSubmitting: false });
							ToastActions.toast('error', responseObject.brief);
						}
					} catch (err) {
						// noop
						LOGGER.logError('ResetPassword', 'ResetPassword failed unable to process ResetPassword response');
					}

					this.setState({
						isSubmitting: false
					});

				}.bind(this));
		} else {
			ToastActions.toast('error', 'Please complete all new password information before saving.');
		}
	},

	/**
	 * Updates and validates the input fields, displays error if any
	 * @param  e {Event} Input box change event
	 */
	onChange: function (e) {
		this.setState({
			[e.target.name]: e.target.value
		});

		let errors = this.state.errors;
		if (e.target.name === 'confirmNewPassword') {

			if (this.state.newPassword !== e.target.value) {
				errors.confirmNewPassword = 'New Passwords do not match';
			} else {
				errors.confirmNewPassword = '';
			}
			this.setState({
				errors
			});
		} else if (e.target.name === 'currentPassword') {
			this.validateCurrentPassword();
			errors.currentPassword = this.stagedErrors.currentPassword;
			this.setState({
				errors
			});
		} else if (e.target.name === 'newPassword') {
			if (!_.isEmpty(this.state.confirmNewPassword)) {

				if (e.target.value !== this.state.confirmNewPassword) {
					errors.confirmNewPassword = 'New Passwords do not match';
				} else {
					errors.confirmNewPassword = '';
				}

				this.setState({
					errors
				});
			}
		}
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {

		return render.ResetPassword.call(this);
	}
});
export default ResetPassword;
