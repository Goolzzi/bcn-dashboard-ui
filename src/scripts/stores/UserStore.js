/**
 * UserInfo store
 * @module UserInfoStore
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Crypto from 'crypto';

import _ from 'lodash';

var CHANGE_EVENT = 'userInfo-change';

/* This is a temporary solution until MockApp.js (or its prod replacement)
 * introduces a wait spinner before loading Dashboard and until the user
 * info is loaded. Otherwise the code breaks due to missing user info. */
var userInfo = {
	role: '',
	username: '',
	email: '',
	name: '',
	password: '',
	isAdministrator: function () {
		return this.role === 'ADMIN';
	}
};

var isProfilePanelShown = false;
var isInitialized = false;

var UserStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Get flag indicating if the store has been initialized
	 * @return {boolean}
	 */
	getInitialized: function () {
		return isInitialized;
	},

	/**
	 * Get user info
	 * @return {Object}
	 */

	getUserInfo: function () {
		return userInfo;
	},


	/**
	 * Validates email address against the stored temporary password
	 * @param  typedPassword {String} Provided password
	 * @return {Boolean}               True if provided password is same as stored password, false otherwise
	 */
	validatePassword: function (typedPassword) {
		var hash = Crypto.createHmac('sha256', typedPassword);
		typedPassword = hash.digest('hex');
		if (userInfo.hasOwnProperty('password') && userInfo.password === typedPassword) {
			return true;
		}
		return false;
	},

	/**
	 * Returns stored e-mail address
	 * @return {String} Email address of user or false otherwise
	 */
	getEmail: function () {
		if (!_.isEmpty(userInfo.email)) {
			return userInfo.email;
		}
		return false;
	},

	/**
	 * Get if sitegroup panel is being shown
	 * @return {Object}
	 */
	isProfilePanelShown: function () {
		return isProfilePanelShown;
	}

});

UserStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.USER_INFO_SET:
		var newUserInfo = action.userInfo;

		if (newUserInfo.hasOwnProperty('role') && !_.isEmpty(newUserInfo.role))
			userInfo.role = newUserInfo.role;

		if (newUserInfo.hasOwnProperty('username') && !_.isEmpty(newUserInfo.username))
			userInfo.username = newUserInfo.username;

		if (newUserInfo.hasOwnProperty('email') && !_.isEmpty(newUserInfo.email))
			userInfo.email = newUserInfo.email;

		if (newUserInfo.hasOwnProperty('name') && !_.isEmpty(newUserInfo.name))
			userInfo.name = newUserInfo.name;

		if (newUserInfo.hasOwnProperty('password') && !_.isEmpty(newUserInfo.password)) {
			var hash = Crypto.createHmac('sha256', newUserInfo.password);
			userInfo.password = hash.digest('hex');
		}

		isInitialized = true;
		userInfo.role = action.userInfo.role;
		userInfo.username = action.userInfo.username;
		UserStore.emitChange();
		break;

	case ActionTypes.USER_INFO_UNSET:
		isInitialized = false;
		userInfo.role = '';
		userInfo.username = '';
		userInfo.email = '';
		userInfo.name = '';
		userInfo.password = '';

		UserStore.emitChange();
		break;

	case ActionTypes.PROFILE_PANEL_SHOW:
		isProfilePanelShown = true;
		UserStore.emitChange();
		break;

	case ActionTypes.PROFILE_PANEL_HIDE:
		isProfilePanelShown = false;
		UserStore.emitChange();
		break;


	default:
		break;
	}
});

export default UserStore;
