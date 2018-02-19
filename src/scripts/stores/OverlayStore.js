/**
 * Domain List store
 * @module Domain List Store
 */

import {
	EventEmitter
} from 'events';

import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';


var CHANGE_EVENT = 'overlayChange-received';
var currentPage = "";

var OverlayStore = Object.assign({}, EventEmitter.prototype, {

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

	getCurrentPage: function () {
		return currentPage;
	}
});

/**
 * Adds domain group object in memory
 * @param {[type]} domainList domain list object to be added.
 */
var changeView = function (view) {
	currentPage = view;
};

OverlayStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {
	case ActionTypes.OVERLAY_CHANGE_VIEW:
		changeView(action.viewName);

		OverlayStore.emitChange();
		break;
	}
});


export default OverlayStore;
