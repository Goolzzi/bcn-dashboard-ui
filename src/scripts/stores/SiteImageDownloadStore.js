/**
 * SiteImageDownload store
 * @module SiteImageDownloadStore
 */
import _ from 'lodash';
import {
	EventEmitter
} from 'events';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import SiteImageStatus from '../constants/SiteImageStatus';

var CHANGE_EVENT = 'sitedownload-change';

var siteImageRequests = {};

var RequestState = {
	REQUESTED: 'REQUESTED',
	REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED',
	REQUEST_FAILED: 'REQUEST_FAILED'
};


var SiteImageDownloadStore = Object.assign({}, EventEmitter.prototype, {

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
	 * Get SiteImageDownload
	 * @return {Object}
	 */
	get: function () {
		return siteImageRequests;
	}
});

SiteImageDownloadStore.dispatchToken = AppDispatcher.register(function (action) {

	switch (action.actionType) {
	case ActionTypes.SITEIMAGE_DOWNLOAD_REQUESTED:
		siteImageRequests[action.data.siteId] = {
			startTime: new Date()
				.getTime(),
			state: RequestState.REQUESTED
		};
		SiteImageDownloadStore.emitChange();
		break;
	case ActionTypes.SITEIMAGE_DOWNLOAD_REQUEST_SUCCEEDED:
		if (!(action.data.siteId in siteImageRequests)) {
			return;
		}
		siteImageRequests[action.data.siteId].state = RequestState.REQUEST_SUCCEEDED;
		SiteImageDownloadStore.emitChange();
		break;
	case ActionTypes.SITEIMAGE_DOWNLOAD_REQUEST_FAILED:
		if (!(action.data.siteId in siteImageRequests)) {
			return;
		}
		delete siteImageRequests[action.data.siteId];
		SiteImageDownloadStore.emitChange();
		break;
	case ActionTypes.SITES_SET:
		if (_.isEmpty(siteImageRequests)) {
			return;
		}

		var sites = action.sites;
		var requestsToRemove = [];

		// Iterator over the site requests to see if location still
		// in list, and if it can be removed
		_.forIn(siteImageRequests, function (siteImageRequest, requestSiteId) {

			// Find site corresponding to request
			var foundSite = _.find(sites, function (site) {
				return site.siteId === requestSiteId;
			});

			// Site no longer in list remove
			if (foundSite === undefined) {
				requestsToRemove.push(requestSiteId);
				return;
			}

			// Only update status if request response has been processed
			if (siteImageRequest.state === RequestState.REQUESTED) {
				return;
			}

			// Status still in not found state, could occur if request for site updates
			// sent before, but processed after response to site request.  Ignore for now
			// and rely on backend to update site status, but maybe need to transition to
			// error state if for any reason site keeps responding in this state after a
			// request is made
			if (foundSite.image.status === SiteImageStatus.NOT_FOUND) {
				return;
			}

			// Status updated in site response, remove request
			requestsToRemove.push(requestSiteId);
		});

		_.forEach(requestsToRemove, function (request) {
			delete siteImageRequests[request];
		});
		SiteImageDownloadStore.emitChange();
		break;
	default:
		break;
	}
});

export default SiteImageDownloadStore;
