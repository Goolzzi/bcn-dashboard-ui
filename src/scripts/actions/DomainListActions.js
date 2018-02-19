import DomainListService from '../services/DomainListService';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import PolicyService from '../services/PolicyService';
import ToastActions from './ToastActions';


var DomainListActions = {
	/**
	 * Fetch all domain lists
	 */
	getAll: function () {
		return DomainListService.getAll({})
			.then(resp => {
				resp.forEach(function (domainList) {
					PolicyService.getPoliciesForDomainList(domainList.id)
						.then(function (policies) {
							AppDispatcher.dispatch({
								actionType: ActionTypes.DOMAINLISTS_POLICY_RETURN,
								id: domainList.id,
								policies: policies
									.filter(function (n) {
										return n.active === true;
									})
							});

						});
				});
				AppDispatcher.dispatch({
					actionType: ActionTypes.DOMAINLISTS_SET,
					domainLists: resp
				});

			})
			.catch((error) => {
				this._handleError();
			});
	},

	/**
	 * Hide Panel
	 */
	close: () => {
		return AppDispatcher.dispatch({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: ''
		});
	},

	_handleError: function () {
		ToastActions.toast('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
	}
};

export default DomainListActions;
