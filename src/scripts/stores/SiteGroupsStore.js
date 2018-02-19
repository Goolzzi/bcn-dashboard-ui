/**
 * Site Group store
 * @module SiteGroupStore
 */

import {
	EventEmitter
} from 'events';

import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import _ from 'lodash';


var CHANGE_EVENT = 'site-groups-received';
var siteGroups = [];
var isInitialized = false;

var SiteGroupsStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Get flag indicating if the sitegroups store has been initialized
	 * @return {boolean}
	 */
	getInitialized: function () {
		return isInitialized;
	},

	/**
	 * Get site groups
	 * @return {Object}
	 */
	getSiteGroups: () => {
		return siteGroups;
	}

});


SiteGroupsStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.SITEGROUPS_SET:
		isInitialized = true;
		siteGroups = action.siteGroups;
		SiteGroupsStore.emitChange();
		break;

	case ActionTypes.SITEGROUPS_CREATE:
		siteGroups.unshift(action.siteGroup);
		SiteGroupsStore.emitChange();
		break;
	case ActionTypes.SITEGROUPS_UPDATE:
		const siteGroupIndex = siteGroups.findIndex((siteGroup) => {
			return siteGroup.siteGroupId === action.siteGroupId;
		});

		if (siteGroupIndex !== -1) {
			Object.assign(siteGroups[siteGroupIndex], action.siteGroup);
		}

		SiteGroupsStore.emitChange();
		break;
	case ActionTypes.SITEGROUPS_DELETE:
		_.remove(siteGroups, {
			siteGroupId: action.siteGroupId
		});

		SiteGroupsStore.emitChange();
		break;
	case ActionTypes.SITEGROUPS_POLICY_RETURN:
		var siteGroupToUpdate = siteGroups.find(function (n) {
			return n.siteGroupId === action.siteGroupId;
		});
		if (siteGroupToUpdate) {
			siteGroupToUpdate.policies = action.policies;
			SiteGroupsStore.emitChange();
		}
		break;
	}

});


export default SiteGroupsStore;
