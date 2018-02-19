jest.dontMock('../src/scripts/components/Spinner/Spinner');
jest.dontMock('../src/scripts/components/Spinner/render.jsx');

describe('Spinner component tests', function () {
	let Spinner = require('../src/scripts/components/Spinner')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');

	var component, element;

	beforeEach(function () {
		component = ReactTestUtils.renderIntoDocument(
			React.createElement(Spinner, {
				classNames: 'class1 class2',
				show: false,
				center: true,
				display: 'block'
			})
		);
		element = ReactDOM.findDOMNode(component);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component)
			.parentNode);
	});

	it('should have class="Spinner"', function () {
		expect(element.getAttribute('class'))
			.toContain('Spinner');
	});

	it('should have spinner icon', function () {
		var icon = element.querySelector('.fa-spinner');
		expect(icon)
			.toBeDefined();
	});

	it('should have class1 class2 classes', function () {
		var class1 = element.querySelector('.class1');
		var class2 = element.querySelector('.class2');
		expect(class1)
			.toBeDefined();
		expect(class2)
			.toBeDefined();
	});

});
