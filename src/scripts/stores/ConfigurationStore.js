/**
 * Authentication store
 * @module AuthStore
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var CHANGE_EVENT = 'configuration-change';

// Interface we're using to store the configuration values
var ConfigurationStoreInterface = window.sessionStorage;

var ConfigurationStore = Object.assign({}, EventEmitter.prototype, {

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

	getIdleTimeoutSeconds: function () {
		return parseInt(ConfigurationStoreInterface.getItem('idleTimeoutSeconds'));
	},

	getTokenRefreshSeconds: function () {
		return parseInt(ConfigurationStoreInterface.getItem('tokenRefreshSeconds'));
	}
});

ConfigurationStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.CONFIGURATION_SET:
		ConfigurationStoreInterface.setItem('idleTimeoutSeconds', action.idleTimeoutSeconds);
		ConfigurationStoreInterface.setItem('tokenRefreshSeconds', action.tokenRefreshSeconds);
		ConfigurationStore.emitChange();
		break;

	default:
		break;
	}
});

export default ConfigurationStore;
