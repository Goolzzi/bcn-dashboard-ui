/**
 * Domain List store
 * @module Domain List Store
 */

import {
	EventEmitter
} from 'events';

import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import _ from 'lodash';

const CHANGE_EVENT = 'domainLists-received';
var domainLists = [];
var isInitialized = false;

var DomainListStore = Object.assign({}, EventEmitter.prototype, {

	throttledEmitChange: null,
	/**
	 * Emit change event, which will be throttled so it
	 * isn't too chatty
	 */
	emitChange: function () {
		if (!this.throttledEmitChange) {
			this.throttledEmitChange = _.throttle(function () {
				this.emit(CHANGE_EVENT);
			}.bind(this), 200);
		}
		this.throttledEmitChange();
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
	 * Get domain lists
	 * @return {Object}
	 */
	getDomainLists: () => {
		return domainLists;
	},

	/**
	 * Get flag indicating if the Domain List store has been initialized
	 * @return {boolean}
	 */
	getInitialized: function () {
		return isInitialized;
	}
});

/**
 * Adds domain group object in memory
 * @param {[type]} domainList domain list object to be added.
 */
var addDomainList = function (domainList) {
	domainLists.push(domainList);
};

DomainListStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.DOMAINLISTS_SET:
		isInitialized = true;
		domainLists = [];

		Object.keys(action.domainLists)
			.forEach(key => {
				addDomainList(action.domainLists[key]);
			});

		DomainListStore.emitChange();
		break;

	case ActionTypes.DOMAINLISTS_POLICY_RETURN:
		var domainToUpdate = domainLists.find(function (n) {
			return n.id === action.id;
		});

		if (domainToUpdate) {
			domainToUpdate.policies = action.policies;
			DomainListStore.emitChange();
		}
		break;
	}
});


export default DomainListStore;
