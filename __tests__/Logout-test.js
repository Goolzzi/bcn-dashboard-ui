jest.dontMock('../src/scripts/router/routes/Logout/components/Logout');
jest.dontMock('../src/scripts/dispatchers/AppDispatcher');
jest.dontMock('../src/scripts/constants/AppConstants');

describe('Logout Test', function () {
	let Logout = require('../src/scripts/router/routes/Logout/components/Logout')
		.default
	let AuthActions = require('../src/scripts/actions/AuthActions')
		.default;
	let AppConstants = require('../src/scripts/constants/AppConstants')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut;
	beforeEach(function () {

		// Mock promise
		AuthActions.logout.mockReturnValue(Promise.resolve(undefined));

		sut = ReactTestUtils.renderIntoDocument( <
			Logout / >
		);
	});


	it('logout is called when the component is mounted', function () {
		expect(AuthActions.logout)
			.toBeCalled();
	});

	it('redirected to login page when logout call is complete', function () {
		var d = deferred();
		AuthActions.logout.mockReturnValue(d.promise);

		// Mock the router push call so we can verify it's being called.
		sut.context.router = {
			push: jest.genMockFunction()
		};

		sut.componentDidMount();
		d.resolveThen(undefined, () => {
			expect(AuthActions.logout)
				.toBeCalled();
			expect(sut.context.router.push)
				.toBeCalledWith(AppConstants.LOGIN_ROUTE);
		});
	});

	it('redirected to login page when logout call fails', function () {
		var d = deferred();
		AuthActions.logout.mockReturnValue(d.promise);

		// Mock the router push call so we can verify it's being called.
		sut.context.router = {
			push: jest.genMockFunction()
		};

		sut.componentDidMount();
		d.rejectThen('fake error', () => {
			expect(AuthActions.logout)
				.toBeCalled();
			expect(sut.context.router.push)
				.toBeCalledWith(AppConstants.LOGIN_ROUTE);
		});
	});

	it('element has expected class', function () {
		var logoutElement = ReactDOM.findDOMNode(sut);
		expect(logoutElement.getAttribute('class'))
			.toEqual('Logout');
	});

});
