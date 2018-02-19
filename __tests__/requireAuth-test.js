 jest.dontMock('../src/scripts/router/requireAuth.js');

 describe('requireAuth Test', function () {
 	let RequireAuth = require('../src/scripts/router/requireAuth')
 		.default;
 	let AuthStore = require('../src/scripts/stores/AuthStore')
 		.default;
 	let AuthService = require('../src/scripts/services/AuthService')
 		.default;
 	let ReactTestUtils = require('react-addons-test-utils');
 	let ReactDOM = require('react-dom');
 	let React = require('react');

 	it('Client should be redirected to login page if not authenticated', function () {
 		AuthStore.isAuthenticated = jest.genMockFunction()
 			.mockReturnValue(false);
 		var callback = jest.genMockFunction();
 		RequireAuth(null, null, callback);

 		// Ideally, window.location.hash should be asserted
 		// Unfortunately, jest does not have native support for mocking windows.location.
 		// Another approach is to move window.location.hash to a seperate function, and
 		// use 'spyOn' to monitor the function, but it does not work for RequireAuth as
 		// it is a function rather than an instance created from module

 		// thus callback is checked as a workaround for now
 		expect(callback)
 			.not.toBeCalled();
 	});

 	it('Client should continue to login page if authenticated', function () {
 		AuthStore.isAuthenticated = jest.genMockFunction()
 			.mockReturnValue(true);
 		var callback = jest.genMockFunction();
 		RequireAuth(null, null, callback);

 		expect(callback)
 			.toBeCalled();
 	});

 });
