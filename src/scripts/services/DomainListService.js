/**
 * Domain Lists Service
 * @module SettingsService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import ApiEndpointService from './ApiEndpointService';

var DomainListService = {
	/**
	 * Fetch dns list
	 * @return {Promise}
	 */
	getAll: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/list/dns',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'GET'
				};

				return Promise.resolve($.ajax(params));
			});
	}

};

export default DomainListService;
