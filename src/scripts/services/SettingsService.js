/**
 * Settings Service
 * @module SettingsService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import ApiEndpointService from './ApiEndpointService';

var SettingsService = {
	/**
	 * getSettings
	 * @return {Promise}
	 */
	getSettings: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/spSettings/global',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'GET'
				};

				return Promise.resolve($.ajax(params));
			});
	},

	/**
	 * getFactorySettings
	 * @return {Promise}
	 */
	getFactorySettings: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(
				function (response) {
					var params = {
						url: 'https://' + response.config + '/v1/api/spSettings/factory',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + AuthStore.getToken()
						},
						type: 'GET'
					};
					return Promise.resolve($.ajax(params));
				}
			);
	},

	/**
	 * updateSettings
	 * @param {string} json
	 * @return {Promise}
	 */
	updateSettings: function (settings) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var data = {
					servers: [{
						ipAddress: settings.forwarding_dns_ip
					}]
				};

				var params = {
					url: 'https://' + response.config + '/v1/api/spSettings/global/update',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'POST',
					data: JSON.stringify(data)
				};

				return Promise.resolve($.ajax(params));
			});
	}
};

export default SettingsService;
