/**
 * Policy actions
 */

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import PolicyService from '../services/PolicyService';
import ToastActions from './ToastActions';

var PolicyActions = {

	/**
	 * Request all policies
	 */
	getAll: function () {
		return PolicyService.getAll({})
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.POLICIES_SET,
					policies: resp
				});
			})
			.catch((error) => {
				this._handleError();
			});
	},

	/**
	 * Hide
	 */
	close: () => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: ''
		});
	},

	/**
	 * Handle any errors having to do with policy actions
	 */
	_handleError: function () {
		ToastActions.toast('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
	}
};

export default PolicyActions;
