/**
 * Returns a promise which resolves after a given length of time.
 * Moved into a separate module so we can mock it more easily.
 */
var TimerActions = {
	timer: function (delay) {
		return new Promise((resolve, reject) => {
			window.setTimeout(resolve, delay);
		});
	}
};

export default TimerActions;
