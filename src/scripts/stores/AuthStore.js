/**
 * Authentication store
 * @module AuthStore
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var CHANGE_EVENT = 'auth-change';

// Interface we're using to store the token
var AuthStoreInterface = window.sessionStorage;

var AuthStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Get
	 * @return {Object}
	 */
	getToken: function () {
		return AuthStoreInterface.getItem('token');
	},

	/**
	 * Get estimated token expiry time
	 * @return {Date} or undefined
	 */
	getTokenExpiry: function () {
		var expiry = AuthStoreInterface.getItem('tokenExpiry');
		if (expiry == undefined) {
			return undefined;
		} else {
			return new Date(parseInt(expiry));
		}
	},

	/**
	 * Validates email address against the stored temporary password
	 * @param  typedPassword {String} Provided password
	 * @return {Boolean}               True if provided password is same as stored password, false otherwise
	 */
	validateTempPassword: function (typedPassword) {
		var tempPassword = AuthStoreInterface.getItem('tempPassword');
		if (tempPassword != undefined && typedPassword === tempPassword) {
			return true;
		}
		return false;
	},

	/**
	 * Returns stored e-mail address
	 * @return {String} Email address of user or false otherwise
	 */
	getEmail: function () {
		var email = AuthStoreInterface.getItem('email');
		if (email != undefined) {
			return email;
		}
		return false;
	},

	/**
	 * Check if user is authenticated
	 * @return {boolean}
	 */
	isAuthenticated: function () {
		return !!this.getToken();
	}
});

AuthStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {

	case ActionTypes.AUTH_TOKEN_SET:
		AuthStoreInterface.setItem('token', action.token);
		AuthStoreInterface.setItem('tokenExpiry', action.tokenExpiry.getTime());
		AuthStore.emitChange();
		break;

	case ActionTypes.AUTH_TOKEN_UNSET:
		AuthStoreInterface.removeItem('token');
		AuthStoreInterface.removeItem('tokenExpiry');
		AuthStore.emitChange();
		break;
	case ActionTypes.AUTH_SET_TEMP_PASSWORD:
		AuthStoreInterface.setItem('tempPassword', action.tempPassword);
		AuthStoreInterface.setItem('email', action.email);
		AuthStore.emitChange();
		break;
	default:
		break;
	}
});

export default AuthStore;
