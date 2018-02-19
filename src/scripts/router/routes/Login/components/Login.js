/**
 * Login Component
 * @author Alexander Luksidadi
 */

import React from 'react';
import AuthStore from '../../../../stores/AuthStore';
import AuthActions from '../../../../actions/AuthActions';
import ToastActions from '../../../../actions/ToastActions';
import IdleActions from '../../../../actions/IdleActions';
import RefreshActions from '../../../../actions/RefreshActions';
import AppConstants from '../../../../constants/AppConstants';

import CustomerNameStore from '../../../../stores/CustomerNameStore';

import './Login.less';
import render from './render.jsx';
import LogManager from './../../../../logger/logger'

const LOGGER = LogManager.getLogger('Login');

/**
 * Login Component
 */
var Login = React.createClass({

	/** Context types */
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	/** Get initial states */
	getInitialState: function () {
		return {
			customerName: CustomerNameStore.getCustomerName(),
			isSubmitting: false
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

	/** Fires after component receives new properties / state */
	shouldComponentUpdate: function () {
		return true;
	},

	/**
	 * Login handler
	 */
	handleLogin: function (e) {
		// prevent the default form submit handler
		// from refreshing the page.
		LOGGER.logInfo('login requested');
		e.preventDefault();
		ToastActions.removeAll();
		var email = this.refs.email.value,
			password = this.refs.password.value;
		if (email && password) {
			this.setState({
				isSubmitting: true
			});
			AuthActions
				.login(email, password)
				.then(function () {
					var x = {
						test: function () {}
					};
					LOGGER.logInfo('login success', x);
					this.context.router.push(AppConstants.DASHBOARD_ROUTE);

				}.bind(this))
				.catch(function (jqXHR, textStatus, errorThrown) {
					var toastString = 'Server error. Please contact your administrator.';
					LOGGER.logError('login failed');
					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							if (responseObject.hasOwnProperty('code') && responseObject.code === 'INVALID_CREDENTIALS') {
								toastString = 'Invalid credentials.  Please try again.';
							}
						}
					} catch (err) {
						// noop
						LOGGER.logError('login failed unable to process login response');
					}

					ToastActions.toast('error', toastString);

					this.setState({
						isSubmitting: false
					});
				}.bind(this));
		} else {
			ToastActions.toast('error', 'Invalid credentials.  Please try again.');
		}
	},

	/**
	 * Redirects to forgot password screen
	 */
	handleForgotPassword: function () {
		this.context.router.push(AppConstants.FORGOT_PASSWORD);
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Login.call(this);
	}
});

export default Login;
