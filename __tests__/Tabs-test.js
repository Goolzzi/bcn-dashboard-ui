jest.dontMock('../src/scripts/components/Tabs/Tabs');
jest.dontMock('../src/scripts/components/Tabs/render.jsx');
jest.dontMock('lodash');
jest.dontMock('classnames');

describe('Tabs component tests', function () {
	let Tabs = require('../src/scripts/components/Tabs')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');

	var items = [
		{
			id: 'dns-activity',
			title: 'dns-activity',
			link: '/item/1',
			getContentCallback: function () {
				return "test";
			}
		},
		{
			id: 'dns-activity2',
			title: 'dns-activity2',
			link: '/item/2',
			getContentCallback: function () {
				return "test";
			}
		}
                ];

	var sut, element;

	beforeEach(function () {
		sut = ReactTestUtils.renderIntoDocument(React.createElement(Tabs, {
			active: 'dns-activity',
			maxY: 100,
			items: items
		}));
		sut.state.itemsById.hasOwnProperty = jest.fn(() => {
			return true
		});
		element = ReactDOM.findDOMNode(sut);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('when we are on the Tabs page, the Tabs should be present"', function () {
		expect(element.getAttribute('class'))
			.toEqual('Tabs');

	});

	it('should have tab items', function () {
		var tabs = element.querySelectorAll('.Tab');
		expect(tabs.length)
			.toEqual(2);
	});

	it('should render content of the active tab', function () {
		var content = element.querySelector('.tab-content')
			.innerHTML;
		expect(content)
			.toEqual(items[0].getContentCallback());
	});
});
