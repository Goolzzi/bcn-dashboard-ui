jest.dontMock('../src/scripts/actions/AuthActions');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.unmock('../__testutils__/timeshift.js');

describe('AuthActions', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var TimeShift = require('../__testutils__/timeshift.js');
	var AuthStore, AuthService, AppDispatcher, ConfigurationStore;
	var sut;

	beforeEach(() => {
		Date = TimeShift.Date;
		TimeShift.setTime(1460000000000);
		AuthStore = require('../src/scripts/stores/AuthStore')
			.default;
		AuthService = require('../src/scripts/services/AuthService')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		ConfigurationStore = require('../src/scripts/stores/ConfigurationStore')
			.default;

		sut = require('../src/scripts/actions/AuthActions')
			.default;
	});

	it('fails when login fails', () => {
		AuthService.login.mockReturnValue(Promise.reject('fake error'));
		return sut.login('test@bluecatnetworks.com', 'password')
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('AuthService should be called with correct param when login is called', function () {


		var token = 'test-token';
		var payload = JSON.stringify({
			token: token,
			token_timeout: 5
		});

		AuthService.login.mockReturnValue(Promise.resolve(payload));

		return sut.login('test@bluecatnetworks.com', 'password')
			.then(() => {

				expect(AppDispatcher.dispatch.mock.calls[0][0].actionType)
					.toEqual(ActionTypes.AUTH_TOKEN_SET);
				expect(AppDispatcher.dispatch.mock.calls[0][0].token)
					.toEqual(token);
				expect(AppDispatcher.dispatch.mock.calls[0][0].tokenExpiry.getTime())
					.toEqual(1460000005000);
			});
	});

	it('AuthService should be called with correct param when logout is called', function () {
		var token = 'test-token';
		AuthStore.getToken.mockReturnValue(token);

		AuthService.logout.mockReturnValue(Promise.resolve(undefined));

		return sut.logout()
			.then(() => {

				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.AUTH_TOKEN_UNSET,
						token: token
					});
			});
	});

	it('should dispatch logout even if logout call fails', function () {
		var token = 'test-token';
		AuthStore.getToken.mockReturnValue(token);

		AuthService.logout.mockReturnValue(Promise.reject('fake error'));

		return sut.logout()
			.then(() => {

				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.AUTH_TOKEN_UNSET,
						token: token
					});
			});
	});

	it('should call AuthService with correct param when refresh is called', function () {
		var token = 'old-token';
		AuthStore.getToken.mockReturnValue(token);

		AuthService.refresh.mockReturnValue(Promise.resolve('{"token":"new-token"}'));

		ConfigurationStore.getTokenRefreshSeconds.mockReturnValue(5);

		return sut.refresh()
			.then(() => {

				expect(AppDispatcher.dispatch.mock.calls[0][0].actionType)
					.toEqual(ActionTypes.AUTH_TOKEN_SET);
				expect(AppDispatcher.dispatch.mock.calls[0][0].token)
					.toEqual('new-token');
				expect(AppDispatcher.dispatch.mock.calls[0][0].tokenExpiry.getTime())
					.toEqual(1460000005000);
			});
	});

	it('AuthService should be called with correct param when resetRequest is called', function () {


		var tempPassword = 'tmp-pw';
		var emailAddress = 'test@bluecatnetworks.com';
		var payload = JSON.stringify();

		AuthService.resetRequest.mockReturnValue(Promise.resolve({
			tempPassword: tempPassword
		}));

		return sut.resetRequest(emailAddress)
			.then(resp => {

				expect(AuthService.resetRequest)
					.toBeCalledWith(emailAddress);

				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.AUTH_SET_TEMP_PASSWORD,
						email: emailAddress,
						tempPassword: tempPassword
					});

			});
	});

	it('AuthService should not dispatch AUTH_SET_TEMP_PASSWORD action when request fails', function () {

		var emailAddress = 'test@bluecatnetworks.com';
		var mock = jest.fn();
		AuthService.resetRequest.mockReturnValue(Promise.reject('fake error'));

		expect(() => {
				sut.resetRequest(emailAddress)
					.then(() => {
						throw new Exception('error');
					})
					.catch(() => {

					});
			})
			.not.toThrow();

		expect(AuthService.resetRequest)
			.toBeCalledWith(emailAddress);

		expect(AppDispatcher.dispatch)
			.not.toBeCalled();
	});

	it('AuthService should be called with correct param when resetPassword is called', function () {

		var tempPassword = 'test-token';
		var payload = JSON.stringify({
			tempPassword: tempPassword
		});

		var data = {
			emailAddress: 'test@domain.com',
			temp_pw: '2caw^3#a32#',
			new_pw: 'temp_password'
		};

		AuthService.resetPassword.mockReturnValue(Promise.resolve(payload));

		return sut.resetPassword(data)
			.then(() => {

				expect(AuthService.resetPassword)
					.toBeCalledWith(data);


			});
	});
});
