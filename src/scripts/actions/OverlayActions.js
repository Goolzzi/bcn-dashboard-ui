/**
 * Policy actions
 */

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ToastActions from './ToastActions';

var OverlayActions = {
	showDomainLists: function () {
		this.changeView('/domainlists');
	},

	showPolicies: function () {
		this.changeView('/policies');
	},

	showSites: function () {
		this.changeView('/sites');
	},

	showSiteGroups: function () {
		this.changeView('/sitegroups');
	},

	changeView: function (viewName) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
			viewName: viewName
		});
	}
};

export default OverlayActions;
