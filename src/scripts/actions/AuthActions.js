/**
 * Authentication related actions
 * @author Alexander Luksidadi
 * @module AuthActions
 */

import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import AppDispatcher from '../dispatchers/AppDispatcher';
import AuthStore from '../stores/AuthStore';
import ConfigurationStore from '../stores/ConfigurationStore';

var AuthActions = {

	/**
	 * Login user
	 * @param {string} email
	 * @param {string} password
	 */
	login: function (email, password) {
		var startTime = new Date();
		return AuthService.login(email, password)
			.then(resp => {
				var obj = JSON.parse(resp);
				var estimatedExpiry = new Date(startTime.getTime() + obj.token_timeout * 1000);
				AppDispatcher.dispatch({
					actionType: ActionTypes.AUTH_TOKEN_SET,
					token: '' + obj.token,
					tokenExpiry: estimatedExpiry
				});

				AppDispatcher.dispatch({
					actionType: ActionTypes.CONFIGURATION_SET,
					idleTimeoutSeconds: obj.idle_timeout,
					tokenRefreshSeconds: obj.token_timeout
				});

				AppDispatcher.dispatch({
					actionType: ActionTypes.USER_INFO_SET,
					userInfo: {
						email: email,
						password: password
					}
				});
			});
	},

	logout: function () {
		var authToken = AuthStore.getToken();
		return AuthService.logout(authToken)
			.catch(() => {}) // don't care if logout fails & want to logout anyway so suppress the error
			.then(() => {
				//clear user info
				AppDispatcher.dispatch({
					actionType: ActionTypes.USER_INFO_UNSET
				});

				//we don't care about the code that's returned from logout,
				//we need to unset the token regardless.
				AppDispatcher.dispatch({
					actionType: ActionTypes.AUTH_TOKEN_UNSET,
					token: authToken
				});
			});
	},

	refresh: function () {
		var authToken = AuthStore.getToken();
		var estimatedExpiry = new Date(new Date()
			.getTime() + ConfigurationStore.getTokenRefreshSeconds() * 1000);
		return AuthService.refresh(authToken)
			.then(resp => {
				var obj = JSON.parse(resp);
				AppDispatcher.dispatch({
					actionType: ActionTypes.AUTH_TOKEN_SET,
					token: '' + obj.token,
					tokenExpiry: estimatedExpiry
				});
			})
			.catch(() => {
				//clear user info
				AppDispatcher.dispatch({
					actionType: ActionTypes.USER_INFO_UNSET
				});

				//we don't care about the code that's returned from logout,
				//we need to unset the token regardless.
				AppDispatcher.dispatch({
					actionType: ActionTypes.AUTH_SET_TEMP_PASSWORD,
					token: authToken
				});
			});
	},

	/**
	 * Reset Password Request
	 * @param {string} email
	 */
	resetRequest: function (email) {
		return AuthService.resetRequest(email)
			.then(resp => {

				if (resp.hasOwnProperty('tempPassword')) {
					AppDispatcher.dispatch({
						actionType: ActionTypes.AUTH_SET_TEMP_PASSWORD,
						email: email,
						tempPassword: resp.tempPassword
					});
				}

			});
	},

	/**
	 * Reset Password
	 * @param {object} passwordDetails Contains email address, temporary password and new password.
	 */
	resetPassword: function (passwordDetails) {
		return AuthService.resetPassword(passwordDetails);
	},



};

export default AuthActions;
