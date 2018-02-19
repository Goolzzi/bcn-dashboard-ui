import AuthActions from '../actions/AuthActions';

function cancelIdleTimer() {
	if (window.idleTimer) {
		window.clearTimeout(window.idleTimer);
		window.idleTimer = undefined;
	}
}

var IdleActions = {
	cancelTimer: function () {
		cancelIdleTimer();
	},

	resetTimer: function (seconds) {
		cancelIdleTimer();
		if (seconds != undefined) {
			window.idleTimer = window.setTimeout(AuthActions.logout, seconds * 1000);
		}
	}
};

export default IdleActions;
