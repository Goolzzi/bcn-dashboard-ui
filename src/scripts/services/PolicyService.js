/**
 * Policy Service
 * @module SettingsService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import ApiEndpointService from './ApiEndpointService';

var PolicyService = {

	getPoliciesForDomainList: function (domainListId) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/policyManagement/policies?domainListId=' + domainListId,
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'GET'
				};
				return Promise.resolve($.ajax(params));
			});

	},


	getPoliciesForSiteGroup: function (siteGroupId) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/policyManagement/policies?siteGroupId=' + siteGroupId,
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
	 * Fetch policies based on provided query
	 * @return {Promise}
	 */
	getAll: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/policyManagement/policies',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'GET'
				};

				return Promise.resolve($.ajax(params));
			});
	}

}

export default PolicyService;
