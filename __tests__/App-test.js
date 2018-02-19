jest.dontMock('../src/scripts/router/routes/App/components/App');
jest.dontMock('../src/scripts/router/routes/App/components/render.jsx');
jest.dontMock('../src/scripts/dispatchers/AppDispatcher');
jest.dontMock('moment');
jest.unmock('../__testutils__/timeshift.js');

describe('App Test', function () {
	let App = require('../src/scripts/router/routes/App/components/App')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let UserStore = require('../src/scripts/stores/UserStore')
		.default;
	let UserActions = require('../src/scripts/actions/UserActions')
		.default;
	let SiteActions = require('../src/scripts/actions/SiteActions')
		.default;
	let RefreshActions = require('../src/scripts/actions/RefreshActions')
		.default;
	let AuthStore = require('../src/scripts/stores/AuthStore')
		.default;
	let ConfigurationStore = require('../src/scripts/stores/ConfigurationStore')
		.default;
	let TimeShift = require('../__testutils__/timeshift.js');

	var app;
	var mockPath = {
		pathname: ''
	};

	var MockElement = React.createClass({
		render: function () {
			return ( < div / > );
		}
	});

	var mockElement = React.createElement(MockElement, {});
	var mockLocation = {
		pathname: 'app'
	};

	beforeEach(function () {


		UserStore.getUserInfo.mockReturnValue('Some user');


		//mock stuff we don't want to actually do things
		UserStore.addChangeListener = jest.fn();
		UserStore.removeChangeListener = jest.fn();
		UserActions.getUserInfo = jest.fn();
		SiteActions.getAllSites = jest.fn();

		// Render the element
		app = ReactTestUtils.renderIntoDocument( <
			App children = {
				mockElement
			}
			location = {
				mockLocation
			}
			/>
		);
	});



	it('Given Rendered page When ComponentDidMount is called then the User Store change listened is added', function () {
		app.componentDidMount();

		expect(UserStore.addChangeListener)
			.toBeCalled();
	});

	it('Given Rendered page When componentWillUnmount is called then the User Store change listened is removed', function () {
		app.componentWillUnmount();

		expect(UserStore.removeChangeListener)
			.toBeCalled();
	});

	it('Given Rendered page When handleUserInfoChange is called then the User Store get user info is called', function () {
		app._handleUserInfoChange();

		expect(UserStore.getUserInfo)
			.toBeCalled();
	});

	it('should request user info and all sites when mounted', function () {
		expect(UserActions.getUserInfo)
			.toBeCalled();
		expect(SiteActions.getAllSites)
			.toBeCalled();
	});


	it('Given Rendered page When not authenticated and handleAuthChange is called then push to login is called', function () {

		//mock the push so nothing dies
		app.context.router = {
			push: jest.genMockFunction()
		};

		app._handleAuthChange();

		expect(app.context.router.push)
			.toBeCalled();
	});

	it('should reset refresh timer when mounted', function () {
		Date = TimeShift.Date;
		TimeShift.setTime(1460000000000);

		AuthStore.getTokenExpiry = jest.genMockFunction()
			.mockReturnValue(new Date(1460000001000));
		ConfigurationStore.getTokenRefreshSeconds = jest.genMockFunction()
			.mockReturnValue(30);

		app.componentWillMount();

		expect(RefreshActions.resetTimer)
			.toBeCalledWith(1000, 30000);
	});

	it('should reset refresh timer with initial time set to expiry time when mounted and no tokenExpiry set', function () {
		Date = TimeShift.Date;
		TimeShift.setTime(1460000000000);

		AuthStore.getTokenExpiry = jest.genMockFunction()
			.mockReturnValue(undefined);
		ConfigurationStore.getTokenRefreshSeconds = jest.genMockFunction()
			.mockReturnValue(30);

		app.componentWillMount();

		expect(RefreshActions.resetTimer)
			.toBeCalledWith(30000, 30000);
	});

	it('should reset refresh timer with initial time of 0 if tokenExpiry was in the past', function () {
		Date = TimeShift.Date;
		TimeShift.setTime(1460000000000);

		AuthStore.getTokenExpiry = jest.genMockFunction()
			.mockReturnValue(new Date(1459999999000));
		ConfigurationStore.getTokenRefreshSeconds = jest.genMockFunction()
			.mockReturnValue(30);

		app.componentWillMount();

		expect(RefreshActions.resetTimer)
			.toBeCalledWith(0, 30000);
	});

});
