/**
 * CApi Auth Service
 * @module  AuthService
 */

import $ from 'jquery';
var DnsResolver = require('./DnsResolver');
var customerApiServiceSrvRecord = 'ui.api.internal';

var AuthService = {

	/**
	 * Login
	 * @param {string} email
	 * @param {string} password
	 * @return {Promise}
	 */
	login: function (email, password) {
		console.log('[config] Customer api host requested.');
		DnsResolver.resolveSrv(customerApiServiceSrvRecord)
			.then(
				function (data) {
					console.log('[login] Authenticating user credentials [' + data.dnsName + ']');
					return Promise.resolve(request({
						url: 'http://' + data.dnsName + '/v1/api/userManagement/authentication/login',
						method: 'POST',
						json: {
							username: email, // 'email' is changed to 'username'
							password: password
						}

					}));
				},
				function (error) {
					console.log('[login] Authentication service discovery failed.');
					res.status(500)
						.send('{\"code\":' + ResponseErrorCode.INTERNAL_SERVER_ERROR + "}");
				}
			);

	},


	/**
	 * Logout
	 * @param {string} token
	 * @return {Promise}
	 */
	logout: function (token) {
		console.log('[config] Customer api host requested.');
		DnsResolver.resolveSrv(customerApiServiceSrvRecord)
			.then(
				function (data) {
					console.log('[logout] Authenticating user credentials [' + data.dnsName + ']');
					return Promise.resolve(request({
						url: 'http://' + data.dnsName + '/v1/api/userManagement/authentication/logout',
						method: 'POST',
						json: {
							token: token
						}
					}));
				},
				function (error) {
					console.log('[logout] Authentication service discovery failed.');
					res.status(500)
						.send('{\"code\":' + ResponseErrorCode.INTERNAL_SERVER_ERROR + "}");
				}
			);

	},

	/**
	 * Refresh
	 * @param {string} token
	 * @return {Promise}
	 */
	refresh: function (token) {
		console.log('[config] Customer api host requested.');
		DnsResolver.resolveSrv(customerApiServiceSrvRecord)
			.then(
				function (data) {
					console.log('[refresh] Authenticating user credentials [' + data.dnsName + ']');
					return Promise.resolve(request({
						url: 'http://' + data.dnsName + '/v1/api/userManagement/authentication/refresh',
						method: 'POST',
						json: {
							token: token
						}
					}));
				},
				function (error) {
					console.log('[refresh] Authentication service discovery failed.');
					res.status(500)
						.send('{\"code\":' + ResponseErrorCode.INTERNAL_SERVER_ERROR + "}");
				}
			);

	}
};

export default AuthService;
