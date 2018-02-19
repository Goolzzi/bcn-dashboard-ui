jest.dontMock('../src/scripts/services/AuthService.js');
jest.dontMock('jquery'); // need $.Deferred()

describe('AuthService Test', function () {
	let AuthService = require('../src/scripts/services/AuthService')
		.default;
	var ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	var $ = require('jquery');

	beforeEach(() => {
		$.ajax = jest.genMockFunction()
			.mockReturnValue($.Deferred());

		ApiEndpointService.getCustomerApiEndpoint = jest.genMockFunction()
			.mockReturnValue(Promise.resolve({
				config: 'localhost:3443'
			}));
	});

	it('jquery param should be valid when login is called', function () {
		var returnValue = '{"token":"sometoken"}';
		$.ajax()
			.resolve(returnValue);

		var email = 'admin@bluecatnetworks.com';
		var password = 'password';

		return AuthService.login(email, password)
			.then(result => {
				expect(result)
					.toBe(returnValue);

				var data = {
					email: email,
					password: password
				};

				expect($.ajax)
					.toBeCalledWith({
						url: '/v1/ui/authenticate',
						contentType: 'application/json',
						type: 'POST',
						data: JSON.stringify(data)
					});
			});
	});

	it('fails login when ajax fails', function () {
		$.ajax()
			.reject();

		var email = 'admin@bluecatnetworks.com';
		var password = 'password';

		return AuthService.login(email, password)
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('jquery param should be valid when logout is called', function () {
		var token = 'some_token';
		$.ajax()
			.resolve(undefined);

		return AuthService.logout(token)
			.then(() => {

				var data = {
					token: token
				};

				expect($.ajax)
					.toBeCalledWith({
						url: '/v1/ui/logout',
						contentType: 'application/json',
						type: 'POST',
						data: JSON.stringify(data)
					});
			});
	});

	it('fails logout when ajax fails', function () {
		$.ajax()
			.reject();
		return AuthService.logout('some_token')
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('jquery param should be valid when refresh is called', function () {
		var returnValue = '{"token":"newtoken"}';
		$.ajax()
			.resolve(returnValue);

		var token = 'some_token';

		return AuthService.refresh(token)
			.then(result => {
				expect(result)
					.toBe(returnValue);

				var data = {
					token: token
				};

				expect($.ajax)
					.toBeCalledWith({
						url: '/v1/ui/refresh',
						contentType: 'application/json',
						type: 'POST',
						data: JSON.stringify(data)
					});
			});
	});

	it('fails refresh when ajax fails', function () {
		$.ajax()
			.reject();
		return AuthService.refresh('some_token')
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('jquery param should be valid when resetRequest is called', function () {
		var returnValue = '{"tempPassword":"password"}';
		$.ajax()
			.resolve(returnValue);

		var email = 'test@domain.com';

		return AuthService.resetRequest(email)
			.then(result => {
				expect(result)
					.toBe(returnValue);

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/userManagement/resetPassword',
						contentType: 'application/json',
						type: 'POST',
						data: JSON.stringify({
							emailAddress: email
						})
					});
			}, () => {});
	});

	it('jquery param should be valid when resetPassword is called', function () {
		var returnValue = '';
		$.ajax()
			.resolve(returnValue);

		var data = {
			emailAddress: 'test@domain.com',
			temp_pw: '2caw^3#a32#',
			new_pw: 'temp_password'
		};

		return AuthService.resetPassword(data)
			.then(result => {
				expect(result)
					.toBe(returnValue);

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/userManagement/setPassword',
						contentType: 'application/json',
						type: 'POST',
						data: JSON.stringify(data)
					});
			});
	});

	it('fails resetPassword when ajax fails', function () {
		$.ajax()
			.reject();

		var data = {
			emailAddress: 'test@domain.com',
			temp_pw: '2caw^3#a32#',
			new_pw: 'temp_password'
		};

		return AuthService.resetPassword(data)
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});
});
