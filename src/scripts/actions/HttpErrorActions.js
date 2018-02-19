/**
 * Http error actions
 * @author Alexander Luksidadi
 * @module HttpErrorActions
 */

import ActionTypes from '../constants/ActionTypes';
import AuthActions from '../actions/AuthActions';
import AppDispatcher from '../dispatchers/AppDispatcher';

var HttpErrorActions = {

	/**
	 * dispatch HttpErrorAction
	 * @param {Object} response - Http response
	 */
	dispatch: function (response) {
		var payload, errors;
		try {
			payload = JSON.parse(response.responseText);
			errors = payload.errors;
		} catch (e) {
			errors = [{
				message: 'An error has occured while fetching data from the server.'
			}];
		}

		switch (response.status) {
		case 400:
			HttpErrorActions.error400(errors);
			break;
		case 401:
			HttpErrorActions.error401(errors);
			break;
		case 403:
			HttpErrorActions.error403(errors);
			break;
		case 404:
			HttpErrorActions.error404(errors);
			break;
		default:
			HttpErrorActions.error5xx(errors);
			break;
		}
	},

	/**
	 * 400 bad request error
	 * @param {Array} errors
	 */
	error400: (errors) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ERROR_400,
			errors: errors
		});
	},

	/**
	 * 401 unauthorized error
	 * @param {Array} errors
	 */
	error401: (errors) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ERROR_401,
			errors: errors
		});
		AuthActions.logout();
	},

	/**
	 * 403 forbidden error
	 * @param {Array} errors
	 */
	error403: (errors) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ERROR_403,
			errors: errors
		});
	},

	/**
	 * 404 not found error
	 * @param {Array} errors
	 */
	error404: (errors) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ERROR_404,
			errors: errors
		});
	},

	/**
	 * 500+ server error
	 * @param {Array} errors
	 */
	error5xx: (errors) => {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ERROR_5XX,
			errors: errors
		});
	}

};

export default HttpErrorActions;
