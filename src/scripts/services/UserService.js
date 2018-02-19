/**
 * Api User Service
 * @module UserService
 */

import $ from 'jquery';
import ApiEndpointService from './ApiEndpointService';
import AuthStore from '../stores/AuthStore';

var UserService = {

	/**
	 * Retrieves user info
	 * @param {string} token
	 * @return {Promise}
	 */
	getUserInfo: function (token) {

		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var data = {
					token: token
				};

				var params = {
					url: '/v1/ui/userinfo',
					contentType: 'application/json',
					type: 'POST',
					data: JSON.stringify(data)
				};

				return Promise.resolve($.ajax(params));
			});
	},

	/**
	 * Update Password
	 * @param {string} email
	 * @return {Promise}
	 */
	updatePassword: function ({
		emailAddress,
		password,
		new_pw
	}) {

		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/userManagement/updatePassword',
					contentType: 'application/json',
					type: 'POST',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					data: JSON.stringify({
						emailAddress: emailAddress,
						password: password,
						new_pw: new_pw
					})
				};
				return Promise.resolve($.ajax(params));
			});
	},
};

export default UserService;
