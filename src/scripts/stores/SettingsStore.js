/**
 * Settings store
 * @module SettingsStore
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var show = false;

var CHANGE_EVENT = 'settings-change';

var SettingsStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Return status of screen display
	 * @return {Object}
	 */
	getIsShown: () => {
		return show;
	}
});

SettingsStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.SETTINGS_SHOW:
		show = true;
		SettingsStore.emitChange();
		break;

	case ActionTypes.SETTINGS_HIDE:
		show = false;
		SettingsStore.emitChange();
		break;

	default:
		break;
	}
});

export default SettingsStore;
