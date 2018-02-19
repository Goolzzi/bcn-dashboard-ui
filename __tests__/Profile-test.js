jest.dontMock('../src/scripts/components/Header/Header.js');
jest.dontMock('../src/scripts/components/Header/render.jsx');
jest.dontMock('../src/scripts/components/CommandBar/CommandBar.js');
jest.dontMock('../src/scripts/components/CommandBar/render.jsx');
jest.dontMock('../src/scripts/components/Profile/Profile.js');
jest.dontMock('../src/scripts/components/Profile/components.jsx');
jest.dontMock('../src/scripts/components/CommandBar/CommandBarPresenter.js');

jest.dontMock('moment');

var me = {
	getFullName() {
		return 'John Doe';
	},

	role: 'Analyst'
};

describe('Profile Component', function () {
	let Profile = require('../src/scripts/components/Profile/Profile.js')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let Simulate = ReactTestUtils.Simulate;
	var component, element;

	beforeEach(function () {
		component = ReactTestUtils.renderIntoDocument( < Profile me = {
				me
			}
			showUserMenu = {
				true
			}
			customerName = 'Waterbottle inc'
			userInfo = {
				{
					role: 'foo',
					username: 'John Doe'
				}
			}
			/>
		);
		element = ReactDOM.findDOMNode(component);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component)
			.parentNode);
	});

	it('should have class="Profile"', function () {
		expect(element.getAttribute('class')
				.indexOf('Profile'))
			.toBeGreaterThan(-1);
	});

	it('should have a logo', function () {
		var logo = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'logo');
		expect(logo)
			.toBeDefined();
		expect(logo.querySelectorAll('img')
				.length)
			.toBe(1);
	});

	it('should have the company name', function () {
		var companyName = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'company-name');
		expect(companyName.textContent.length)
			.toBeGreaterThan(0);
	});

	it('should have the user\'s name', function () {
		var userData = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'name');
		expect(userData.textContent.indexOf('John Doe'))
			.toBeGreaterThan(-1);
	});

	it('should not have UserMenu by default', function () {
		var userMenu = element.querySelector('.UserMenu');
		expect(userMenu)
			.toBeNull();
	});

	it('should open UserMenu when caret is clicked', function () {
		Simulate.click(element.querySelector('.user-menu-toggle'), {});
		var userMenu = element.querySelector('.UserMenu');
		expect(userMenu)
			.toBeDefined();
	});
});
