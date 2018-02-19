import ActionTypes from '../constants/ActionTypes';
import SiteService from '../services/SiteService';
import AppDispatcher from '../dispatchers/AppDispatcher';
import AppConstants from '../constants/AppConstants';


var SiteActions = {
	latestResultSequence: 0,
	callSequence: 1,

	/**
	 * Hide
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
	createSite: (newSite) => {
		return SiteService.createSite(newSite)
			.then(resp => {

			});
	},

	/**
	 * Get all sites
	 */
	getAllSites: function () {
		return SiteService.getAll()
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITES_SET,
					sites: resp
				});
			});
	},

	/**
	 * Get all sites
	 */
	getAllSitesSummary: function () {
		return SiteService.getSummary()
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITES_SUMMARY_SET,
					sites_summary: resp
				});
			});
	},

	/**
	 * Get all sites
	 */
	getSuggestions: function (startsWith) {
		return SiteService.search(startsWith, 10)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITE_SUGGESTIONS_SET,
					suggestions: resp
				});
			});
	}

};

export default SiteActions;
