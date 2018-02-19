/**
 * ApiEndpoint Service
 * @module ApiEndpointService
 */

import $ from 'jquery';
import AppConstants from '../constants/AppConstants';

var ApiEndpointService = {
	/**
	 * getCustomerApiEndpoint
	 * @return {Promise}
	 */
	getCustomerApiEndpoint: function () {
		var params = {
			url: AppConstants.CONFIG_ROUTE,
			contentType: 'application/json',
			type: 'GET'
		};

		return Promise.resolve($.ajax(params));
	}
};

export default ApiEndpointService;
