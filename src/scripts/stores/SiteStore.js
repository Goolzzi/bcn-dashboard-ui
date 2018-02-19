/**
 * Sites store
 * @module SiteStore
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import _ from 'lodash';

var isInitialized = false;

var CHANGE_EVENT = 'sites-change';
var sites = [];

var SUGGESTIONS_EVENT = 'suggestions-change';
var suggestions = [];

var SiteStore = Object.assign({}, EventEmitter.prototype, {

	/**
	 * Emit change event
	 */
	emitChange: function () {
		this.emit(CHANGE_EVENT);
	},

	/**
	 * Emit suggestions change event
	 */
	emitSuggestionsChange: function () {
		this.emit(SUGGESTIONS_EVENT);
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
	 * Add suggestions change event listener
	 * @param {function} callback
	 */
	addSuggestionsChangeListener: function (callback) {
		this.on(SUGGESTIONS_EVENT, callback);
	},

	/**
	 * remove suggestions change event listener
	 * @param {function} callback
	 */
	removeSuggestionsChangeListener: function (callback) {
		this.removeListener(SUGGESTIONS_EVENT, callback);
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
		return sites;
	},

	/**
	 * Get site by Id
	 * @return {Object}
	 */
	getById: function (siteId) {
		var index = _.findIndex(sites, function (o) {
			return o.siteId == siteId;
		});
		if (index != -1)
			return sites[index];
		return null;
	},

	/**
	 * Get site suggestions
	 * @return [site,.. ]
	 */
	getSuggestions: function () {
		return suggestions;
	},

	/**
	 * Clear the suggestion store
	 */
	clearSuggestions: function () {
		suggestions = [];
	}

});

SiteStore.dispatchToken = AppDispatcher.register(function (action) {
	switch (action.actionType) {
	case ActionTypes.SITES_ADD:
		sites.push(action.sites);
		SiteStore.emitChange();
		break;

	case ActionTypes.SITES_SET:
		isInitialized = true;
		sites = action.sites;
		SiteStore.emitChange();
		break;

	case ActionTypes.SITES_UNSET:
		sites = [];
		SiteStore.emitChange();
		break;

	case ActionTypes.SITE_SUGGESTIONS_SET:
		suggestions = action.suggestions;
		SiteStore.emitSuggestionsChange();
		break;

	default:
		break;
	}
});

export default SiteStore;
