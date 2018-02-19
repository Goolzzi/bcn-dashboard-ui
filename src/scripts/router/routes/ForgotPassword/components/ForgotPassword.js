/**
 * ForgotPassword Component
 */

import React from 'react';
import AuthStore from '../../../../stores/AuthStore';
import AuthActions from '../../../../actions/AuthActions';
import ToastActions from '../../../../actions/ToastActions';
import IdleActions from '../../../../actions/IdleActions';
import RefreshActions from '../../../../actions/RefreshActions';
import AppConstants from '../../../../constants/AppConstants';

import CustomerNameStore from '../../../../stores/CustomerNameStore';

import './ForgotPassword.less';
import render from './render.jsx';
import LogManager from './../../../../logger/logger'
const LOGGER = LogManager.getLogger('ForgotPassword');


// import validator from 'validator';

/**
 * ForgotPassword Component
 */
var ForgotPassword = React.createClass({

	/** Context types */
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	/** Get initial states */
	getInitialState: function () {
		return {
			customerName: CustomerNameStore.getCustomerName(),
			isSubmitting: false,
			isEmailSent: false
		};
	},

	/** Fires before component is mounted */
	componentWillMount: function () {
		if (AuthStore.isAuthenticated()) {
			this.context.router.push(AppConstants.DASHBOARD_ROUTE);
		}
		IdleActions.cancelTimer();
		RefreshActions.cancelTimer();
	},

	/** Redirect To Login Screen */
	redirectToResetPassword: function () {
		this.context.router.push(AppConstants.RESET_PASSWORD);
	},

	/** Redirect To Login Screen */
	redirectToLogin: function () {
		this.context.router.push(AppConstants.LOGIN_ROUTE);
	},

	/**
	 * ForgotPassword handler
	 */
	handleForgotPasswordRequest: function (e) {
		// prevent the default form submit handler
		// from refreshing the page.
		LOGGER.logInfo('ForgotPassword', 'reset requested');
		e.preventDefault();
		ToastActions.removeAll();
		var email = this.refs.email.value;
		var re = /\S+@\S+\.\S+/;

		if (re.test(email)) {
			this.setState({
				isSubmitting: true
			});
			AuthActions
				.resetRequest(email)
				.then(function (i) {
					LOGGER.logError('ForgotPassword', 'reset success');

					this.setState({
						isEmailSent: true,
						isSubmitting: false
					});

				}.bind(this))
				.catch(function (jqXHR, textStatus, errorThrown) {
					var toastString = 'Server error. Please contact your administrator.';
					LOGGER.logError('ForgotPassword', 'handleForgotPasswordRequest - reset failed');
					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							if (responseObject.hasOwnProperty('code')) {
								toastString = responseObject.brief;
							}
						}
					} catch (err) {
						// noop
						LOGGER.logError('ForgotPassword', 'handleForgotPasswordRequest - reset failed unable to process reset response');
					}

					ToastActions.toast('error', toastString);

					this.setState({
						isSubmitting: false
					});
				}.bind(this));
		} else {
			ToastActions.toast('error', 'Please provide valid email address');
		}
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.ForgotPassword.call(this);
	}
});

export default ForgotPassword;
