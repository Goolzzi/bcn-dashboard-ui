jest.dontMock('../src/scripts/components/Header/Header.js');
jest.dontMock('../src/scripts/components/Header/render.jsx');
jest.dontMock('../src/scripts/components/CommandBar/CommandBar.js');
jest.dontMock('../src/scripts/components/CommandBar/render.jsx');
jest.dontMock('../src/scripts/components/Profile/Profile.js');
jest.dontMock('../src/scripts/components/Profile/components.jsx');
jest.dontMock('../src/scripts/components/CommandBar/CommandBarPresenter.js');
jest.dontMock('../src/scripts/services/AuthService.js');
jest.dontMock('../src/scripts/actions/AuthActions.js');
jest.dontMock('../src/scripts/router/routes/Login/components/Login.js');
jest.dontMock('moment');

describe('Header Component', function () {
	let Header = require('../src/scripts/components/Header/Header.js')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let moment = require('moment');
	let MockDate = require('mockdate');

	var component, element;

	var me = {
		getFullName() {
			return 'John Doe';
		}
	};

	var location = {
		pathname: ''
	};

	var userInfo = {
		role: 'role',
		username: 'username'
	};

	var customerName = 'Header Unit Test';

	var startDate = new Date();
	beforeEach(function () {
		MockDate.set(startDate);

		component = ReactTestUtils.renderIntoDocument( < Header me = {
				me
			}
			location = {
				location
			}
			userInfo = {
				userInfo
			}
			customerName = {
				customerName
			}
			/>
		);
		element = ReactDOM.findDOMNode(component);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component)
			.parentNode);
	});


	it('should have the Profile', function () {
		var mainNav = element.querySelector('.Profile');
		expect(mainNav)
			.toBeDefined();
	});

	it('should have the Command Bar', function () {
		var commandBar = element.querySelector('.CommandBar');
		expect(commandBar)
			.toBeDefined();
	});

	it('should have the Date and Time element', function () {
		var datetimeElement = element.querySelector('.DateAndTime');
		expect(datetimeElement)
			.toBeDefined();
	});

	it('should have the current Date', function () {
		var datetimeElement = element.querySelector('.DateAndTime');
		expect(datetimeElement.firstChild.innerHTML)
			.toEqual(moment(startDate)
				.format('MMMM DD, YYYY'));
	});

});
