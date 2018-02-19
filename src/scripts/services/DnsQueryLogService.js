/**
 * Alert Service
 * @module DnsQueryLogService
 */

import $ from 'jquery';
import AuthStore from '../stores/AuthStore';
import FilterStore from '../stores/FilterStore';
import ApiEndpointService from './ApiEndpointService';

import LogManager from '../logger/logger';

const LOGGER = LogManager.getLogger('DnsQueryLogService');

var activeRequests = {};
var nextRequestId = 0;

function executeDnsQueryRequest(request) {
	return ApiEndpointService.getCustomerApiEndpoint()
		.then((resp) => {
			return registerAjaxRequest(request(resp));
		});
}

function registerAjaxRequest(ajaxRequest) {

	var currentRequestId = nextRequestId++;
	activeRequests[currentRequestId] = ajaxRequest;

	LOGGER.logDebug('New dnsActivty request: ' + currentRequestId);

	// Prevents calling all items in the promise chain
	// if the call is aborted.
	var deferred = $.Deferred();
	ajaxRequest.then((resp) => {
			deferred.resolve(resp);
		}, (error) => {
			// Checking text sucks but don't know of another way.. ? status === 0?
			if (error.statusText === 'abort') {
				LOGGER.logDebug('DnsActivty request aborted');
				return;
			}
			deferred.reject(error);
		})
		.always(() => {
			LOGGER.logDebug('Remove completed dnsactivty request: ' + currentRequestId);
			delete activeRequests[currentRequestId];
		});

	return Promise.resolve(deferred);
}

function cancelAllActiveDnsQueryRequests() {
	LOGGER.logDebug('Aborting all outstanding DnsActivty Requests');
	for (var requestId in activeRequests) {
		LOGGER.logDebug('Aborting request: ' + requestId);
		activeRequests[requestId].abort();
	}
	activeRequests = {};
}

var DnsQueryLogService = {

	cancelActiveRequests: function () {
		cancelAllActiveDnsQueryRequests();
	},

	queryNewLogs: function (startKey, numRecords) {
		return executeDnsQueryRequest((resp) => {
				var params = {
					type: 'GET',
					url: 'https://' + resp.config + '/v1/api/customer/dnsQueryLog',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + AuthStore.getToken()
					},
					data: Object.assign({}, FilterStore.getFilters(), {
						batchSize: numRecords,
						key: startKey,
						order: 'ASC'
					})
				};
				return $.ajax(params);
			})
			.then((resp) => resp.reverse());
	},

	queryOldLogs: function (startKey, numRecords) {
		return executeDnsQueryRequest((resp) => {
			var params = {
				type: 'GET',
				url: 'https://' + resp.config + '/v1/api/customer/dnsQueryLog',
				contentType: 'application/json',
				headers: {
					'Authorization': 'Bearer ' + AuthStore.getToken()
				},
				data: Object.assign({}, FilterStore.getFilters(), {
					batchSize: numRecords,
					key: startKey,
					order: 'DESC'
				})
			};
			return $.ajax(params);
		});
	}


};

export default DnsQueryLogService;
