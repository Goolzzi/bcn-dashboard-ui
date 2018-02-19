/**
 * Toast related actions
 * @author Alexander Luksidadi
 * @module ToastActions
 */

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var ToastActions = {

	/**
	 * toast
	 */
	toast: (type, text, clickHandler) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.TOAST,
			type: type,
			text: text,
			clickHandler: clickHandler
		});
	},

	/**
	 * remove
	 */
	remove: (key) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.TOAST_REMOVE,
			key: key
		});
	},


	/**
	 * remove all toasts of a certain type
	 */
	removeByType: (type) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.TOAST_REMOVE_TYPE,
			type: type
		});
	},

	/**
	 * remove all toasts
	 */
	removeAll: () => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.TOAST_REMOVE_ALL
		});
	}

};

export default ToastActions;
