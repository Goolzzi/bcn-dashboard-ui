/**
 * Location Service
 * @module SiteService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import ApiEndpointService from './ApiEndpointService';



var SiteService = {

	createSite: function (newSite) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/sites/create',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'POST',
					data: JSON.stringify(newSite)
				};

				return Promise.resolve($.ajax(params));
			});
	},

	/**
	 * all
	 * @return {Promise}
	 */
	getAll: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/sites',
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
	 * all
	 * @return {Promise}
	 */
	getSummary: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/sites?fields=siteName,siteId,location',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'GET'
				};

				return Promise.resolve($.ajax(params));
			});
	},

	search: function (input, desiredResultCount) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/sites/search',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					data: {
						siteNameContains: input,
						desiredResultCount: desiredResultCount
					},
					type: 'GET'
				};

				return Promise.resolve($.ajax(params));
			});
	},

	getSite: function (siteName) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (apiEndpoint) {
				var params = {
					url: 'https://' + apiEndpoint.config + '/v1/api/customer/sites/get',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					data: {
						siteName: siteName
					},
					type: 'GET'
				};

				return Promise.resolve($.ajax(params));
			});
	},

	updateSite: function (siteName, dnsResolverIp) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (apiEndpoint) {
				var serverList = [];
				if (dnsResolverIp != null && dnsResolverIp !== '') {
					serverList = [{
						ipAddress: dnsResolverIp
					}];
				}

				var request = {
					siteName: siteName,
					settings: {
						servers: serverList
					}
				};

				var params = {
					url: 'https://' + apiEndpoint.config + '/v1/api/customer/sites/update',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					contentType: 'application/json',
					data: JSON.stringify(request),
					type: 'POST'
				};

				return Promise.resolve($.ajax(params));
			});
	}
};

export default SiteService;
