import AuthActions from '../actions/AuthActions';

function cancelRefreshTimer() {
	if (window.refreshTimer) {
		window.clearInterval(window.refreshTimer);
		window.refreshTimer = undefined;
	}
	if (window.initialRefreshTimer) {
		window.clearTimeout(window.initialRefreshTimer);
		window.initialRefreshTimer = undefined;
	}
}

var RefreshActions = {
	cancelTimer: function () {
		cancelRefreshTimer();
	},

	resetTimer: function (initialMilliseconds, repeatMilliseconds) {
		cancelRefreshTimer();
		if (repeatMilliseconds != undefined) {
			window.initialRefreshTimer = window.setTimeout(
				function () {
					AuthActions.refresh();
					window.refreshTimer = window.setInterval(AuthActions.refresh, repeatMilliseconds);
				},
				initialMilliseconds);
		}
	}
};

export default RefreshActions;
