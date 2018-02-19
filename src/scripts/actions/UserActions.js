import UserService from '../services/UserService';
import AuthAction from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatchers/AppDispatcher';

var UserActions = {

	/**
	 * Get user info
	 */
	getUserInfo: function () {
		var token = AuthStore.getToken();

		return UserService.getUserInfo(token)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.USER_INFO_SET,
					userInfo: resp
				});
			})
			.catch(() => {
				AuthAction.logout();
			});
	},

	/**
	 * Set/Update User Password
	 * @param {object} passwordDetails Contains current password and new password.
	 */
	updatePassword: function (passwordDetails) {
		return UserService.updatePassword(passwordDetails)
			.then(resp => {
				AppDispatcher.dispatch({
					actionType: ActionTypes.USER_INFO_SET,
					userInfo: {
						password: passwordDetails.new_pw
					}
				});

				this.hideProfile();
				AuthAction.logout();
			});
	},

	/**
	 * Shows user profile screen
	 */
	showProfile: function () {
		return AppDispatcher.dispatch({
			actionType: ActionTypes.PROFILE_PANEL_SHOW
		});
	},

	/**
	 * Hides user profile screen
	 */
	hideProfile: function () {
		return AppDispatcher.dispatch({
			actionType: ActionTypes.PROFILE_PANEL_HIDE
		});
	}
};

export default UserActions;
