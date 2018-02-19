import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';
import SiteImageDownloadService from '../services/SiteImageDownloadService';

var SiteImageDownloadActions = {

	requestSiteImage: function (siteId) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUESTED,
			data: {
				siteId: siteId
			}
		});

		return SiteImageDownloadService.requestSiteImage(siteId)
			.then(function () {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUEST_SUCCEEDED,
					data: {
						siteId: siteId
					}
				});
			})
			.catch(function (error) {
				AppDispatcher.dispatch({
					actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUEST_FAILED,
					data: {
						siteId: siteId
					}
				});
				throw error;
			});
	}
};

export default SiteImageDownloadActions;
