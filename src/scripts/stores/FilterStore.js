/**
 * Filter Store
 * @module FilterStore
 */

import {
	EventEmitter
} from 'events';


import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var CHANGE_EVENT = 'filter-changed';
var FILTERS = 'filters';


// Interface we're using to store the token
var FilterStoreInterface = window.sessionStorage;

var FilterStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Remove change event listener
	 * @param {function} callback
	 */
	removeChangeListener: function (callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	/**
	 * Get filter
	 * @return {Object}
	 */
	getFilters: function () {
		var filters = FilterStoreInterface.getItem(FILTERS);
		if (filters != null) {
			var flt = JSON.parse(filters);
			if (flt.filters != null) {
				return flt.filters;
			}
		}

		return null;
	},

	getCommandText: function () {
		var filters = FilterStoreInterface.getItem(FILTERS);
		if (filters != null) {
			var flt = JSON.parse(filters);
			if (flt.commandText != null) {
				return flt.commandText;
			}
		}

		return null;
	}
});

FilterStore.dispatchFilter = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.AUTH_TOKEN_UNSET:
	case ActionTypes.FILTER_DELETE:
		FilterStoreInterface.removeItem(FILTERS);
		FilterStore.emitChange();
		break;

	case ActionTypes.FILTER_UPDATE:
		var jsonstr = JSON.stringify({
			filters: action.filters,
			commandText: action.commandText
		});
		FilterStoreInterface.setItem(FILTERS, jsonstr);
		FilterStore.emitChange();
		break;

	default:
		break;
	}
});


export default FilterStore;
