/**
 * Toast store
 * @module Toaster
 */

import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import _ from 'lodash';

var DURATION = 8000;
var CHANGE_EVENT = 'toast-change';

var id = 0;
var messages = [];

var settings = {
	bufferSize: 3
};

var Toaster = Object.assign({}, EventEmitter.prototype, {

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
	getMessages: () => {
		return messages;
	},

	// This should probably be refactored i
	getApplicationErrorOccured: () => {
		return _.find(messages, function (msg) {
			return msg.type === 'application-error'
		}) !== undefined;
	}
});

var removeToastByIndex = (index) => {
	if (index == null || index < 0 || index >= messages.length) {
		return;
	}
	var message = messages[index];
	clearTimeout(message.timerId);
	/*if (message.fat) {
	    fatToastActive = false;
	}*/
	messages.splice(index, 1);
};

var removeToastByType = (type) => {
	removeToastByIndex(messages.findIndex(function (message) {
		return type === message.type;
	}));
};

var removeToastById = (id) => {
	removeToastByIndex(messages.findIndex(function (message) {
		return id === message.id;
	}));
};

var removeOldToastMessage = () => {
	if (messages.length > 0) {
		messages.shift();
	}
};

var addToastMessage = (type, text, clickHandler, duration, fat = false) => {

	if (Toaster.getApplicationErrorOccured()) {
		return;
	}

	var currentId = id;
	id++;
	if (!duration) {
		duration = DURATION;
	}

	var timerId = null;
	if (type !== 'application-error' && type !== 'dnsquerylog-new') {
		timerId = setTimeout(function () {
			if (!fat) {
				removeToastById(currentId);
				Toaster.emitChange();
			}
		}, duration);
	} else {
		removeToastByType(type);
	}

	if (type === 'application-error') {
		removeAll();
	}

	messages.push({
		id: currentId,
		type: type,
		text: text,
		clickHandler: clickHandler,
		duration: duration,
		timerId: timerId,
		fat: fat
	});
};

var removeAll = () => {
	messages.forEach(function (message) {
		clearTimeout(message.timerId);
	});
	messages.length = 0;
};

Toaster.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {
	case ActionTypes.TOAST:
		if (messages.length === settings.bufferSize) {
			removeOldToastMessage();
			addToastMessage(action.type, action.text, action.clickHandler);
		} else {
			addToastMessage(action.type, action.text, action.clickHandler);
		}
		Toaster.emitChange();
		break;

	case ActionTypes.TOAST_REMOVE:
		removeToastById(action.key);
		Toaster.emitChange();
		break;

	case ActionTypes.AUTH_TOKEN_UNSET:
		removeAll();
		Toaster.emitChange();
		break;

	case ActionTypes.TOAST_REMOVE_ALL:
		removeAll();
		Toaster.emitChange();
		break;

	case ActionTypes.TOAST_REMOVE_TYPE:
		removeToastByType(action.type);
		Toaster.emitChange();
		break;

	case ActionTypes.FILTER_DELETE:
	case ActionTypes.FILTER_UPDATE:
		removeToastByType('dnsquerylog-new');
		Toaster.emitChange();
		break;

	default:
		break;
	}
});

export default Toaster;
