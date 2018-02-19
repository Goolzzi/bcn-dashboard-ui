import SiteGroupService from '../services/SiteGroupService';
import AppDispatcher from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import PolicyService from '../services/PolicyService';
import ToastActions from './ToastActions';


var SiteGroupActions = {
	/**
	 * Fetch all site groups with limit and before parameters.
	 */
	getAll: function () {
		return SiteGroupService.getAll({})
			.then(resp => {
				resp.forEach(function (siteGroup) {
					PolicyService.getPoliciesForSiteGroup(siteGroup.siteGroupId)
						.then(function (policies) {
							AppDispatcher.dispatch({
								actionType: ActionTypes.SITEGROUPS_POLICY_RETURN,
								siteGroupId: siteGroup.siteGroupId,
								policies: policies
									.filter(function (n) {
										return n.active === true;
									})
							});

						});
				});

				AppDispatcher.dispatch({
					actionType: ActionTypes.SITEGROUPS_SET,
					siteGroups: resp
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

	/**
	 * Create
	 */
	createSiteGroup: (newSiteGroup) => {
		return SiteGroupService.createSiteGroup(newSiteGroup)
			.then(resp => {

				AppDispatcher.dispatch({
					actionType: ActionTypes.SITEGROUPS_CREATE,
					siteGroup: resp
				});

				PolicyService.getPoliciesForSiteGroup(resp.siteGroupId)
					.then(function (policies) {
						AppDispatcher.dispatch({
							actionType: ActionTypes.SITEGROUPS_POLICY_RETURN,
							siteGroupId: resp.siteGroupId,
							policies: policies
								.filter(function (n) {
									return n.active === true;
								})
						});

					});

			});
	},

	/**
	 * update site group as per details specified as "siteGroup"
	 * @param {Object} site_group Object containing details of site group to be added.
	 * @return {Promise}
	 */
	updateSiteGroup: (siteGroupId, updatedSiteGroup) => {
		return SiteGroupService.updateSiteGroup(siteGroupId, updatedSiteGroup)
			.then(() => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITEGROUPS_UPDATE,
					siteGroupId: siteGroupId,
					siteGroup: updatedSiteGroup
				});
			});
	},

	deleteSiteGroup: (siteGroupId) => {
		return SiteGroupService.deleteSiteGroup(siteGroupId)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITEGROUPS_DELETE,
					siteGroupId: siteGroupId
				});
			});
	},

	_handleError: function () {
		ToastActions.toast('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
	}

};

export default SiteGroupActions;
