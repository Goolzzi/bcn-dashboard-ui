jest.dontMock('../src/scripts/stores/ConfigurationStore');
jest.dontMock('../src/scripts/constants/ActionTypes');

jest.dontMock('object-assign');
jest.mock('../src/scripts/dispatchers/AppDispatcher');

describe('ConfigurationStore Test', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var callback;
	var ConfigurationStore;
	var AppDispatcher;

	var configurationSet = {
		actionType: ActionTypes.CONFIGURATION_SET,
		idleTimeoutSeconds: 1,
		tokenRefreshSeconds: 2
	};

	beforeEach(function () {

		//mock the session storage
		var mock = (function () {
			var store = {};
			return {
				removeItem: function (key) {
					store[key] = null;
				},
				getItem: function (key) {
					return store[key];
				},
				setItem: function (key, value) {
					store[key] = value.toString();
				},
				clear: function () {
					store = {};
				}
			};
		})();
		Object.defineProperty(window, 'sessionStorage', {
			value: mock
		});

		//mock the app dispatcher
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		ConfigurationStore = require('../src/scripts/stores/ConfigurationStore')
			.default;
		callback = AppDispatcher.register.mock.calls[0][0];
	});

	it('sets idleTimeout and tokenRefreshSettings when calling CONFIGURATION_SET', function () {
		callback(configurationSet);

		expect(ConfigurationStore.getIdleTimeoutSeconds())
			.toEqual(1);
		expect(ConfigurationStore.getTokenRefreshSeconds())
			.toEqual(2);
	});
});
