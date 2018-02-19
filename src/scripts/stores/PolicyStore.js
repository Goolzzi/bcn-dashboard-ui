/**
 * Policy store
 * @module PolicyStore
 */

import {
	EventEmitter
} from 'events';

import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import _ from 'lodash';

const CHANGE_EVENT = 'policies-received';
var policies = [];
var isInitialized = false;

var PolicyStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Get policies
	 * @return {Object}
	 */
	getPolicies: () => {
		return policies;
	},

	/**
	 * Get flag indicating if the Policy store has been initialized
	 * @return {boolean}
	 */
	getInitialized: function () {
		return isInitialized;
	}

});

/**
 * Adds policy object in memory
 * @param {[type]} policy Policy object to be added.
 */
var addPolicy = function (policy) {
	policies.push(policy);
};

PolicyStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.POLICIES_SET:
		isInitialized = true;
		policies = [];

		Object.keys(action.policies)
			.forEach(key => {
				addPolicy(action.policies[key]);
			});

		PolicyStore.emitChange();
		break;
	}
});


export default PolicyStore;
