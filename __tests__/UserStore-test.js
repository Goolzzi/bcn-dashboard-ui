jest.dontMock('../src/scripts/stores/UserStore');
jest.dontMock('../src/scripts/constants/ActionTypes');

jest.dontMock('object-assign');
jest.mock('../src/scripts/dispatchers/AppDispatcher');

describe('UserStore', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var callback;
	var UserStore;
	var AppDispatcher;

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

		UserStore = require('../src/scripts/stores/UserStore')
			.default;

		//mock the app dispatcher
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		callback = AppDispatcher.register.mock.calls[0][0];
	});

	it('should call registered listeners when user info changes', function() {
		var mockStoreChangeListener = jest.genMockFunction();
		UserStore.addChangeListener( mockStoreChangeListener );

		expect(mockStoreChangeListener).not.toBeCalled();

		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com'
			}
		});
		expect(mockStoreChangeListener).toBeCalled();
	});


	it('should not call registered listeners when unknown event occurs', function() {
		var mockStoreChangeListener = jest.genMockFunction();
		UserStore.addChangeListener( mockStoreChangeListener );

		callback({
			actionType: 'akawakaw',
		});
		expect(mockStoreChangeListener).not.toBeCalled();
	});


	it('should return true for userInfo isAdministrator if user role equals ADMIN', function() {
		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com'
			}
		});
		expect(UserStore.getUserInfo().isAdministrator()).toBeFalsy();
		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'ADMIN',
				username: 'test@bluecatnetworks.com'
			}
		});
		expect(UserStore.getUserInfo().isAdministrator()).toBeTruthy();
	});

	it('should not call listeners that have been unregistered when user info changes', function() {
		var mockStoreChangeListener = jest.genMockFunction();
		UserStore.addChangeListener( mockStoreChangeListener );

		expect(mockStoreChangeListener).not.toBeCalled();

		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com'
			}
		});
		expect(mockStoreChangeListener).toBeCalled();
		UserStore.removeChangeListener( mockStoreChangeListener );

		mockStoreChangeListener.mockReset();

		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com'
			}
		});

		expect(mockStoreChangeListener).not.toBeCalled();
	});



	it('should return false when getInitialized called before user info set', function() {
		expect(UserStore.getInitialized()).toBeFalsy();
	});


	it('should return false when getInitialized called before user info set', function() {
		expect(UserStore.getInitialized()).toBeFalsy();
	});

	it('should return true when getInitialized called afer user info set', function() {
		expect(UserStore.getInitialized()).toBeFalsy();
		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com'
			}
		});
		expect(UserStore.getInitialized()).toBeTruthy();
	});

	it('should return false when getInitialized called afer user info unset', function() {
		expect(UserStore.getInitialized()).toBeFalsy();
		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com'
			}
		});
		expect(UserStore.getInitialized()).toBeTruthy();

		callback({
			actionType: ActionTypes.USER_INFO_UNSET,
		});
		expect(UserStore.getInitialized()).toBeFalsy();
	});

	it('should save new user info when USER_INFO_SET action is dispatched', function () {
		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				role: 'test',
				username: 'test@bluecatnetworks.com',
				email: 'test@bluecatnetworks.com',
				name: 'Test Name',
				password: 'hello'
			}
		});

		expect(UserStore.getUserInfo()
				.role)
			.toBe('test');
		expect(UserStore.getUserInfo()
				.username)
			.toBe('test@bluecatnetworks.com');
		expect(UserStore.getUserInfo()
				.email)
			.toBe('test@bluecatnetworks.com');
		expect(UserStore.getUserInfo()
				.name)
			.toBe('Test Name');
		expect(UserStore.validatePassword('hello'))
			.toBeTruthy();
		expect(UserStore.getEmail())
			.toBe('test@bluecatnetworks.com');

	});

	it('should delete existing user info when USER_INFO_UNSET action is dispatched', function () {
		callback({
			actionType: ActionTypes.USER_INFO_UNSET
		});

		expect(UserStore.getUserInfo()
				.role)
			.toBe('');
		expect(UserStore.getUserInfo()
				.username)
			.toBe('');
		expect(UserStore.getUserInfo()
				.email)
			.toBe('');
		expect(UserStore.getUserInfo()
				.name)
			.toBe('');
		expect(UserStore.getUserInfo()
				.password)
			.toBe('');
	});

	it('should set isProfilePanelShown when PROFILE_PANEL_SHOW action is dispatched', function () {

		expect(UserStore.isProfilePanelShown())
			.toBeFalsy();

		callback({
			actionType: ActionTypes.PROFILE_PANEL_SHOW
		});

		expect(UserStore.isProfilePanelShown())
			.toBeTruthy();
	});

	it('should set isProfilePanelShown when PROFILE_PANEL_HIDE action is dispatched', function () {

		callback({
			actionType: ActionTypes.PROFILE_PANEL_SHOW
		});

		expect(UserStore.isProfilePanelShown())
			.toBeTruthy();

		callback({
			actionType: ActionTypes.PROFILE_PANEL_HIDE
		});

		expect(UserStore.isProfilePanelShown())
			.toBeFalsy();
	});


	it('should validatePassword work properly', function () {
		var isValid = UserStore.validatePassword('random_password');
		expect(isValid)
			.toBe(false);

		callback({
			actionType: ActionTypes.USER_INFO_SET,
			userInfo: {
				password: 'random_password'
			}
		});

		isValid = UserStore.validatePassword('random_password');
		expect(isValid)
			.toBe(true);

		var isValid = UserStore.validatePassword('incorrect_password');
		expect(isValid)
			.toBe(false);

	})

});
