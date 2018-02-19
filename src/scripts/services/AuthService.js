/**
 * Api Auth Service
 * @module  AuthService
 */

import $ from 'jquery';
import ApiEndpointService from './ApiEndpointService';

var AuthService = {

	/**
	 * Login
	 * @param {string} email
	 * @param {string} password
	 * @return {Promise}
	 */
	login: function (email, password) {
		var data = {
			email: email,
			password: password
		};

		var params = {
			url: '/v1/ui/authenticate',
			contentType: 'application/json',
			type: 'POST',
			data: JSON.stringify(data)
		};

		return Promise.resolve($.ajax(params));
	},

	/**
	 * Logout
	 * @param {string} token
	 * @return {Promise}
	 */
	logout: function (token) {
		var data = {
			token: token
		};

		var params = {
			url: '/v1/ui/logout',
			contentType: 'application/json',
			type: 'POST',
			data: JSON.stringify(data)
		};

		return Promise.resolve($.ajax(params));
	},

	/**
	 * Refresh
	 * @param {string} token
	 * @return {Promise}
	 */
	refresh: function (token) {
		var data = {
			token: token
		};

		var params = {
			url: '/v1/ui/refresh',
			contentType: 'application/json',
			type: 'POST',
			data: JSON.stringify(data)
		};

		return Promise.resolve($.ajax(params));
	},

	/**
	 * Reset Password Request
	 * @param {string} email
	 * @return {Promise}
	 */
	resetRequest: function (email) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {

				var params = {
					url: 'https://' + response.config + '/v1/api/userManagement/resetPassword',
					contentType: 'application/json',
					type: 'POST',
					data: JSON.stringify({
						emailAddress: email
					})
				};

				return Promise.resolve($.ajax(params));
			}.bind(this));
	},

	/**
	 * Reset Password
	 * @param {string} email
	 * @return {Promise}
	 */
	resetPassword: function ({
		emailAddress,
		temp_pw,
		new_pw
	}) {

		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/userManagement/setPassword',
					contentType: 'application/json',
					type: 'POST',
					data: JSON.stringify({
						emailAddress: emailAddress,
						temp_pw: temp_pw,
						new_pw: new_pw
					})
				};
				return Promise.resolve($.ajax(params));
			});
	},

};

export default AuthService;
