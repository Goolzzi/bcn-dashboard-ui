/**
 * Settings actions
 * @author Alexander Luksidadi
 * @module SettingsActions
 */

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var SettingsActions = {

	/**
	 * Show
	 */
	show: function (node) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SETTINGS_SHOW
		});
	},

	/**
	 * Hide
	 */
	hide: () => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SETTINGS_HIDE
		});
	}
};

export default SettingsActions;
