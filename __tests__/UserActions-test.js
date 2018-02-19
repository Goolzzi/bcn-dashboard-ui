jest.dontMock('../src/scripts/actions/UserActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

describe('UserActions', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	let AppDispatcher, UserService, sut, AuthAction;

	beforeEach(() => {
		sut = require('../src/scripts/actions/UserActions')
			.default;

		UserService = require('../src/scripts/services/UserService')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		AuthAction = require('../src/scripts/actions/AuthActions')
			.default;
	});



	it('should request from UserService when calling getUserInfo', function () {

		var payload = {
			role: 'Administrator',
			username: 'admin@bluecatnetworks.com',
			name: 'Test Name',
			email: 'admin@bluecatnetworks.com'
		};

		UserService.getUserInfo.mockReturnValue(Promise.resolve(payload));

		return sut.getUserInfo()
			.then(() => {

				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.USER_INFO_SET,
						userInfo: payload
					});
			});
	});

	it('Given userAction When getUserInfo returns 500 Then logout is called', function () {

		var payload = {
			role: 'Administrator',
			username: 'admin@bluecatnetworks.com'
		};

		//todo: figure out how to make this fail
		UserService.getUserInfo.mockReturnValue(Promise.reject('fake 500'));

		return sut.getUserInfo()
			.then(() => {
				expect(AuthAction.logout)
					.toBeCalled();
			});
	});


	it('should dispatch PROFILE_PANEL_SHOW when showProfile is called', function () {

		sut.showProfile();

		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.PROFILE_PANEL_SHOW
			});
	});

	it('should dispatch PROFILE_PANEL_HIDE when hideProfile is called', function () {

		sut.hideProfile();

		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.PROFILE_PANEL_HIDE
			});

	});


	it('should call updatePassword of UserService when updatePassword is invoked', function () {

		var passwordDetails = {
			password: 'current_password',
			new_pw: 'new_password',
			email: 'admin@bluecatnetworks.com'
		};

		//todo: figure out how to make this fail
		UserService.updatePassword.mockReturnValue(Promise.resolve());

		sut.updatePassword(passwordDetails)
			.then(() => {

				expect(UserService.updatePassword)
					.toBeCalledWith(passwordDetails);

				expect(AppDispatcher.dispatch.mock.calls.length)
					.toBe(2);

				// ensure pw updated locally
				expect(AppDispatcher.dispatch.mock.calls[0][0])
					.toEqual({
						actionType: ActionTypes.USER_INFO_SET,
						userInfo: {
							password: 'new_password'
						}
					});

				// // ensure pw updated locally
				expect(AppDispatcher.dispatch.mock.calls[1][0])
					.toEqual({
						actionType: ActionTypes.PROFILE_PANEL_HIDE
					});

				/// ensure user is logged out
				expect(AuthAction.logout)
					.toBeCalled();
			});
	});


});
