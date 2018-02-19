/**
 * Sites store
 * @module SiteSummayStore
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import _ from 'lodash';
import LogManager from '../logger/logger';

const LOGGER = LogManager.getLogger('SiteSummayStore');


var isInitialized = false;

var CHANGE_EVENT = 'site-summary-change';
var sites_summary = [];


var SiteSummayStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Determine if sites store has been initialized
	 */
	getInitialized: function () {
		return isInitialized;
	},

	/**
	 * Get sites
	 * @return {Object}
	 */
	get: function () {
		return sites_summary;
	},

	/**
	 * Get site by Id
	 * @return {Object}
	 */
	getById: function (siteId) {
		var index = _.findIndex(sites_summary, function (o) {
			return o.siteId == siteId;
		});
		if (index != -1) {
			return sites_summary[index];
		}
		return null;
	}
});

SiteSummayStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {
	case ActionTypes.SITES_SUMMARY_SET:
		isInitialized = true;
		LOGGER.logInfo('Updating site summary store.  SiteCount: %d', action.sites_summary.length);
		sites_summary = action.sites_summary;
		SiteSummayStore.emitChange();
		break;
	default:
		break;
	}
});

export default SiteSummayStore;
