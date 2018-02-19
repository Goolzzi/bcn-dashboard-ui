import {
	vsprintf
} from 'sprintf-js';

// Interface we're using to store the token
var logger_settings = window.sessionStorage;

var debug_logging_enabled = () => {
	return logger_settings && logger_settings.getItem('logDebug') === 'true';
}

// functional interface is (format, ..args)
// see https://www.npmjs.com/package/sprintf-js
var logManager = {
	getLogger: function (ctx) {
		return {
			ctx: ctx,
			logError: function (format, ...args) {
				console.log('[ERROR] [' + this.ctx + '] ' + vsprintf(format, args));
			},

			logInfo: function (format, ...args) {
				console.log('[INFO] [' + this.ctx + '] ' + vsprintf(format, args));
			},

			logDebug: function (format, ...args) {
				if (!debug_logging_enabled()) {
					return;
				}
				console.log('[DEBUG] [' + this.ctx + '] ' + vsprintf(format, args));
			}
		}
	}
}

export default logManager;
