/**
 * SiteImageDownload Service
 * @module SiteImageDownloadService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import ApiEndpointService from './ApiEndpointService';

var SiteImageDownloadService = {
	/**
	 * getSiteImage
	 * @return {Promise}
	 */
	requestSiteImage: function (siteId) {
		return ApiEndpointService.getCustomerApiEndpoint()
			.then(function (response) {
				var data = {
					siteId: siteId
				};
				var params = {
					url: 'https://' + response.config + '/v2/api/spImage/generate',
					contentType: 'application/json',
					type: 'POST',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					data: JSON.stringify(data)
				};

				return Promise.resolve($.ajax(params));
			});
	}
};

export default SiteImageDownloadService;
