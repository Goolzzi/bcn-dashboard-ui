/**
 * Site Group Service
 * @module SiteGroupService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import ApiEndpointService from './ApiEndpointService';

var SiteGroupService = {

	/**
	 * Fetch site groups based on provided query
	 * @return {Promise}
	 */
	getAll: function () {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/siteGroups',
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
	 * Adds site group as per details specified as "newSiteGroup"
	 * @param {Object} siteGroup Object containing details of site group to be added.
	 * @return {Promise}
	 */
	createSiteGroup: function (newSiteGroup) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/siteGroups/create',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'POST',
					data: JSON.stringify(newSiteGroup)
				};

				return Promise.resolve($.ajax(params));
			});
	},

	/**
	 * Updates a site group as per details specified as "updatedSiteGroup"
	 * @param {Object} siteGroup Object containing details of site group to be updated
	 * @return {Promise}
	 */
	updateSiteGroup: function (siteGroupId, updatedSiteGroup) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/siteGroups/' + siteGroupId + '/update',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'POST',
					data: JSON.stringify(updatedSiteGroup)
				};

				return Promise.resolve($.ajax(params));
			});
	},

	/**
	 * update site group as per details specified as "siteGroup"
	 * @param {Object} site_group Object containing details of site group to be added.
	 * @return {Promise}
	 */
	deleteSiteGroup: function (siteGroupId) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var params = {
					url: 'https://' + response.config + '/v1/api/customer/siteGroups/' + siteGroupId + '/delete',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					type: 'POST'
				};

				return Promise.resolve($.ajax(params));
			});
	},
};

export default SiteGroupService;
