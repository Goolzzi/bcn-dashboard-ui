/**
 * DnsQueryLogStore
 * @module DnsQueryLogStore
 */

import {
	EventEmitter
} from 'events';


import ActionTypes from '../constants/ActionTypes';
import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatchers/AppDispatcher';

import LogManager from '../logger/logger';

const LOGGER = LogManager.getLogger('DnsQueryLogStore');


var CHANGE_EVENT = 'alert-types-change';
var dnsQueryLogs = [];

var isNewDataAvailable = false;
var initialKey = null;
var keyStart = null;
var keyEnd = null;
var numQueryLogsAdded = 0;

var DnsQueryLogStore = Object.assign({}, EventEmitter.prototype, {

	/**
	 * Emit change event
	 */
	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * Add change event listener
	 * @param {function} callback
	 */
	addChangeListener: function (callback) {
		this.on(CHANGE_EVENT, callback);
	},

	/**
	 * remove change event listener
	 * @param {function} callback
	 */
	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	/**
	 * Get DNS Query Logs
	 * @return {Object}
	 */
	getQueryLogs: function () {
		return dnsQueryLogs;
	},

	getInitialKey() {
		return initialKey;
	},

	getStartKey() {
		return keyStart;
	},

	getEndKey() {
		return keyEnd;
	},

	getIsMoreOldLogsAvailable() {
		return keyEnd !== null;
	},

	getIsMoreNewLogsAvailable() {
		return (keyStart !== null) && (keyStart !== initialKey);
	},

	getNumQueryLogsAdded() {
		return numQueryLogsAdded;
	},

	isNewDataAvailable() {
		return isNewDataAvailable;
	}

});

DnsQueryLogStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {
	case ActionTypes.DNSQUERIES_ADD_NEW:
		// Filter out unwanted logs
		for (var k = 0; k < action.dnsQueryLogs.length; ++k) {
			if (action.dnsQueryLogs[k].recordId === initialKey) {
				action.dnsQueryLogs = action.dnsQueryLogs.slice(k);
				break;
			}
		}
		numQueryLogsAdded = Math.min(action.dnsQueryLogs.length, AppConstants.QUERYLOGS_MAX_BUFFER);
		// Append existing data
		Array.prototype.push.apply(action.dnsQueryLogs, dnsQueryLogs);
		// Remove extra if needed and set last key id
		keyEnd = null;
		if (action.dnsQueryLogs.length > AppConstants.QUERYLOGS_MAX_BUFFER) {
			dnsQueryLogs = action.dnsQueryLogs.slice(0, AppConstants.QUERYLOGS_MAX_BUFFER);
			keyEnd = dnsQueryLogs[dnsQueryLogs.length - 1].recordId;
		} else if (action.dnsQueryLogs.length) {
			dnsQueryLogs = action.dnsQueryLogs;
			keyEnd = dnsQueryLogs[dnsQueryLogs.length - 1].recordId;
		}

		// Update start and end
		if (dnsQueryLogs.length > 0) {
			keyStart = dnsQueryLogs[0].recordId;
		}
		LOGGER.logDebug('DNSQUERIES_ADD_NEW fetched logs size:', action.dnsQueryLogs.length);
		LOGGER.logDebug('DNSQUERIES_ADD_NEW stored logs size:', dnsQueryLogs.length, ' ks', keyStart, ' ke', keyEnd);
		DnsQueryLogStore.emitChange();
		break;
	case ActionTypes.DNSQUERIES_INITIALIZE:
		LOGGER.logDebug('DNSQUERIES_INITIALIZE data size:', action.dnsQueryLogs.length);
		dnsQueryLogs = [];
		numQueryLogsAdded = action.dnsQueryLogs.length;
		keyStart = null;
		keyEnd = null;
		if (action.dnsQueryLogs.length) {
			dnsQueryLogs = action.dnsQueryLogs;
			initialKey = action.dnsQueryLogs[0].recordId;
			keyStart = initialKey;
			if (action.hasMoreData) {
				keyEnd = action.dnsQueryLogs[action.dnsQueryLogs.length - 1].recordId;
			}
		}
		isNewDataAvailable = false;
		DnsQueryLogStore.emitChange();
		break;
	case ActionTypes.DNSQUERIES_ADD_OLD:
		numQueryLogsAdded = Math.min(action.dnsQueryLogs.length, AppConstants.QUERYLOGS_MAX_BUFFER);
		LOGGER.logDebug('DNSQUERIES_ADD_OLD got ', action.dnsQueryLogs.length, ' logs, hasMore:', action.hasMoreData);
		Array.prototype.push.apply(dnsQueryLogs, action.dnsQueryLogs);
		LOGGER.logDebug('DNSQUERIES_ADD_OLD new size:', dnsQueryLogs.length);
		// Keep only the QUERYLOGS_MAX_BUFFER items
		if (dnsQueryLogs.length > 0) {
			if (dnsQueryLogs.length > AppConstants.QUERYLOGS_MAX_BUFFER) {
				dnsQueryLogs = dnsQueryLogs.slice(-AppConstants.QUERYLOGS_MAX_BUFFER);
				LOGGER.logDebug('DNSQUERIES_ADD_OLD resized to:', dnsQueryLogs.length);
			}
			keyStart = dnsQueryLogs[0].recordId;
		}
		if (action.hasMoreData) {
			keyEnd = action.dnsQueryLogs[action.dnsQueryLogs.length - 1].recordId;
		} else {
			keyEnd = null;
		}
		DnsQueryLogStore.emitChange();
		break;
	case ActionTypes.DNSQUERIES_NEW_DATA_AVAILABLE:
		if (action.dnsQueryLogs.length !== 0) {
			isNewDataAvailable = true;
			DnsQueryLogStore.emitChange();
		}
		break;
	case ActionTypes.DNSQUERIES_ERROR_HTTP:
		LOGGER.logDebug('DNSQUERIES_ERROR_HTTP error:' + action.error);
		keyEnd = null;
		keyStart = null;
		isNewDataAvailable = false;
		DnsQueryLogStore.emitChange();
		break;
	default:
		break;
	}
});

export default DnsQueryLogStore;
