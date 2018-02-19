import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

import DnsQueryLogService from '../services/DnsQueryLogService';

import LogManager from '../logger/logger';

const LOGGER = LogManager.getLogger('DnsQueryLogActions');

var DnsQueryLogActions = {

	cancelAllActiveRequests: function () {
		LOGGER.logDebug('cancelAllActiveRequests');
		return DnsQueryLogService.cancelActiveRequests();
	},

	getInitialDnsQueryLogs: function (numRecords) {
		LOGGER.logDebug('getInitialDnsQueryLogs');
		return DnsQueryLogService.queryOldLogs(null, numRecords)
			.then(resp => {
				LOGGER.logDebug('getInitialDnsQueryLogs - success');
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_INITIALIZE,
					dnsQueryLogs: resp,
					hasMoreData: resp.length === numRecords
				});
			})
			.catch((error) => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
					error: error
				});
				throw error;
			});
	},

	getNewDnsQueryLogs: function (keyId, numRecords) {
		return DnsQueryLogService.queryNewLogs(keyId, numRecords)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_ADD_NEW,
					dnsQueryLogs: resp,
					hasMoreData: resp.length === numRecords
				});
			})
			.catch((error) => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
					error: error
				});
				throw error;
			});
	},

	getOldDnsQueryLogs: function (keyId, numRecords) {
		return DnsQueryLogService.queryOldLogs(keyId, numRecords)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_ADD_OLD,
					dnsQueryLogs: resp,
					hasMoreData: resp.length === numRecords
				});
			})
			.catch((error) => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
					error: error
				});
				throw error;
			});
	},

	isNewDataAvailable: function (keyId) {
		return DnsQueryLogService.queryNewLogs(keyId, 1)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_NEW_DATA_AVAILABLE,
					dnsQueryLogs: resp
				});
			})
			.catch((error) => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
					error: error
				});
				throw error;
			});
	}

};

export default DnsQueryLogActions;
