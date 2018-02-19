/**
 * Filter actions
 * @module FilterActions
 */

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var haveFiltersToApply = false;
var filters = {
	from: null,
	to: null,
	siteName: null
};

function _getTimeStamp(time) {
	if (time === null || time === '') {
		return null;
	}

	var hms = time.split(':');
	if (hms.length < 3) {
		// Log invalid time error
		return null;
	}

	var date = new Date( /*Date.now()*/ );
	date.setHours(parseInt(hms[0]), parseInt(hms[1]), parseInt(hms[2]), 0); //TODO: Add ms
	return date.getTime();
}

function _updateFilters(cmdTxt) {
	// Remove all null values
	var filt = {};
	for (var attr in filters) {
		if (filters.hasOwnProperty(attr) && (filters[attr] !== null)) {
			filt[attr] = filters[attr];
		}
	}
	AppDispatcher.dispatch({
		actionType: ActionTypes.FILTER_UPDATE,
		filters: filt,
		commandText: cmdTxt
	});
}

function _timeInPast(time) {
	if (time === null || time === '') {
		return false;
	}

	var now = new Date()
		.getTime();
	var timeMs = _getTimeStamp(time);
	return timeMs <= now;
}

function _isValidTimeRange(msFromTime, msToTime) {
	if (msFromTime === null || msToTime === null) {
		return false;
	}

	var now = new Date()
		.getTime();
	return (msFromTime < now &&
		msToTime <= now &&
		msFromTime < msToTime);
}

function _error(code) {
	FilterActions.deleteFilters();
	throw new Error(code);
}

function _clearParams() {
	// reset parameters
	haveFiltersToApply = false;
	filters.to = null;
	filters.from = null;
	filters.siteName = null;
}

var FilterActions = {

	executeAction: function (commandText) {
		if (haveFiltersToApply) {
			_updateFilters(commandText);
			_clearParams();
		}
	},

	resetParams: function () {
		_clearParams();
	},

	from: function (time) {
		// Make sure it's not set yet
		if (filters.from !== null) {
			_error('NONEMPTY_FILTER');
		}

		if (time === null || time === '') {
			_error('INVALID_PARAMETER');
		}

		// Check from time is in the past
		if (!_timeInPast(time)) {
			_error('FUTURE_TIME');
		}

		// Change time to unix time
		var utc = _getTimeStamp(time);
		if (utc === null) {
			_error('UNPARSEABLE_TIME');
		}

		// Make sure to time is greater than from time
		if (parseInt(filters.to) <= utc) {
			_error('TO_FROM_TIME');
		}

		filters.from = utc;
		haveFiltersToApply = true;
	},

	to: function (time) {
		// Make sure it's not set yet
		if (filters.to !== null) {
			_error('NONEMPTY_FILTER');
		}

		if (time === null || time == '') {
			_error('INVALID_PARAMETER');
		}

		// Make sure to time is not in the future
		if (!_timeInPast(time)) {
			_error('FUTURE_TIME');
		}

		// Change time to unix time
		var utc = _getTimeStamp(time);
		if (utc === null) {
			_error('UNPARSEABLE_TIME');
		}

		// Make sure to time is greater than from time
		if (utc <= parseInt(filters.from)) {
			_error('TO_FROM_TIME');
		}

		filters.to = utc;
		haveFiltersToApply = true;
	},

	at: function (time) {
		// Make sure it's not set yet
		if ((filters.from !== null) || (filters.from !== null)) {
			_error('NONEMPTY_FILTER');
		}

		if (time === null || time === '') {
			_error('INVALID_PARAMETER');
		}

		// Change time to unix time
		var fromTime = _getTimeStamp(time);
		if (fromTime === null) {
			_error('UNPARSEABLE_TIME');
		}

		var toTime = fromTime + 1000;

		// Validate time range
		if (!_isValidTimeRange(fromTime, toTime)) {
			_error('FUTURE_TIME');
		}

		filters.from = fromTime;
		filters.to = toTime;
		haveFiltersToApply = true;
	},

	site: function (siteName) {
		// Make sure it's not set yet
		if (filters.siteName !== null) {
			_error('NONEMPTY_FILTER');
		}
		filters.siteName = siteName;
		haveFiltersToApply = true;
	},

	deleteFilters: function () {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_DELETE
		});
	}
};

export default FilterActions;
