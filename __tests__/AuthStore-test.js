jest.dontMock('../src/scripts/stores/AuthStore');
jest.dontMock('../src/scripts/constants/ActionTypes');

jest.dontMock('object-assign');
jest.mock('../src/scripts/dispatchers/AppDispatcher');

describe('AuthStore Test', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var callback;
	var AuthStore;
	var AppDispatcher;

	var actionSet = {
		actionType: ActionTypes.AUTH_TOKEN_SET,
		token: 'TESTTOKEN',
		tokenExpiry: new Date()
	};

	var actionUnSet = {
		actionType: ActionTypes.AUTH_TOKEN_UNSET
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
		AuthStore = require('../src/scripts/stores/AuthStore')
			.default;
		callback = AppDispatcher.register.mock.calls[0][0];
	});

	it('Given AuthStore When setting a token is called Then nothing breaks', function () {
		callback(actionSet);

		var tkn = AuthStore.getToken();
		expect(tkn)
			.toEqual('TESTTOKEN');

		var expiry = AuthStore.getTokenExpiry();
		expect(expiry)
			.toEqual(actionSet.tokenExpiry);
	});

	it('Given AuthStore When unsetting a token is called Then nothing breaks', function () {
		callback(actionSet);
		callback(actionUnSet);

		var tkn = AuthStore.getToken();
		expect(tkn)
			.toBe(null);

		var expiry = AuthStore.getTokenExpiry();
		expect(expiry)
			.toBe(undefined);
	});

	it('registers a callback with the dispatcher', function () {
		expect(AppDispatcher.register.mock.calls.length)
			.toBe(1);
	});

	it('addChangeListenerRemoveChangeListener', function () {
		AuthStore.addChangeListener(callback);
		AuthStore.removeChangeListener(callback);
	});

	it('isAuthenticated', function () {
		var isAuth = AuthStore.isAuthenticated();
		expect(isAuth)
			.toBe(false);
		callback(actionSet);
		isAuth = AuthStore.isAuthenticated();
		expect(isAuth)
			.toBe(true);
	})


	it('should validateTempPassword work properly', function () {
		var isValid = AuthStore.validateTempPassword('random_password');
		expect(isValid)
			.toBe(false);

		callback({
			actionType: ActionTypes.AUTH_SET_TEMP_PASSWORD,
			email: 'test@bluecatnetworks.com',
			tempPassword: 'random_password'
		});

		isValid = AuthStore.validateTempPassword('random_password');
		expect(isValid)
			.toBe(true);

		var isValid = AuthStore.validateTempPassword('incorrect_password');
		expect(isValid)
			.toBe(false);

	})


	it('should getEmail work properly', function () {
		var email = AuthStore.getEmail();
		expect(email)
			.toBe(false);

		callback({
			actionType: ActionTypes.AUTH_SET_TEMP_PASSWORD,
			email: 'test@bluecatnetworks.com',
			tempPassword: 'random_password'
		});

		email = AuthStore.getEmail();
		expect(email)
			.toEqual('test@bluecatnetworks.com');
	})

});
