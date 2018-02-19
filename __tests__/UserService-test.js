jest.dontMock('../src/scripts/services/UserService');
jest.dontMock('jquery');

describe('UserService', function () {

	var AuthStore = require('../src/scripts/stores/AuthStore')
		.default;
	let sut = require('../src/scripts/services/UserService')
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

		AuthStore.getToken.mockReturnValue('test-token');

		ApiEndpointService.getCustomerApiEndpoint = jest.genMockFunction()
			.mockReturnValue(Promise.resolve({
				config: 'localhost:3443'
			}));
	});

	it('jquery param should be valid when getUserInfo is called', function () {

		$.ajax()
			.resolve('response');

		return sut.getUserInfo('test-token')
			.then(() => {

				var data = {
					token: 'test-token'
				};

				expect($.ajax)
					.toBeCalledWith({
						url: '/v1/ui/userinfo',
						contentType: 'application/json',
						type: 'POST',
						data: JSON.stringify(data)
					});
			});
	});


	it('jquery param should be valid when updatePassword is called', function () {

		$.ajax()
			.resolve('response');

		var data = {
			emailAddress: 'admin@bluecatnetworks.com',
			password: 'current_password',
			new_pw: 'new_password'
		};

		return sut.updatePassword(data)
			.then(() => {

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/userManagement/updatePassword',
						contentType: 'application/json',
						type: 'POST',
						headers: {
							'Authorization': 'Bearer test-token'
						},
						data: JSON.stringify(data)
					});
			});
	});

});
