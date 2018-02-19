jest.unmock('../src/scripts/components/Overlay/Overlay.js');
jest.unmock('../src/scripts/components/Overlay/render.jsx');
jest.unmock('classnames');

import { mount } from 'enzyme';

describe('Overlay Component', function () {
	let Spinner = require('../src/scripts/components/Spinner')
		.default;
	let Overlay = require('../src/scripts/components/Overlay')
		.default;

	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let Simulate = ReactTestUtils.Simulate;

	var component, element;
	let zIndexClass, isShown, closeHandler, breadcrumb;
	closeHandler = jest.genMockFunction();

	beforeEach(function () {

		zIndexClass = "1";
		isShown = true;
		breadcrumb = [
			{
				"title": "Overlay Crumbs"
			},
			{
				"title": "Overlay Title"
			}
		];

		component = ReactTestUtils.renderIntoDocument(
			React.createElement(Overlay, {
				zIndexClass,
				isShown,
				closeHandler,
				breadcrumb
			})
		);
		element = ReactDOM.findDOMNode(component);
		// console.log(element.innerHTML);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component)
			.parentNode);
	});

	it('should have class="active" when isShown="true"', function () {
		expect(element.getAttribute('class')
				.indexOf('active'))
			.toBeGreaterThan(-1);
	});

	it('should have breadcrumb when provided', function () {
		expect(element.querySelector('.content-wrap h3'))
			.toBeDefined();
	});

	it('should have close button', function () {
		expect(element.querySelector('.actions-wrap .close-button'))
			.toBeDefined();
	});

	it('should have back button', function () {
		expect(element.querySelector('.content-wrap h3 .back-button'))
			.toBeDefined();
	});

	it('breadcrumb title should be the last item in the breadcrumb', function () {
		expect(element.querySelector('.content-wrap h3')
				.textContent)
			.toContain("Overlay Title");
	});

	it('breadcrumb sub title should have provided second last item', function () {
		expect(element.querySelector('.content-wrap h3 span .highlighted')
				.textContent)
			.toContain("Overlay Crumbs");
	});

	it('should call closeHandler when clicked on close button', function () {
		var closeIcon = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'close-button');
		ReactTestUtils.Simulate.click(closeIcon);
		expect(closeHandler)
			.toBeCalled();

	});

	it('should call closeHandler when clicked on back button', function () {
		var closeIcon = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'back-button');
		ReactTestUtils.Simulate.click(closeIcon);
		expect(closeHandler)
			.toBeCalled();

	});


	it('should show close button with ban icon when isForm is provided and true', function () {

		var tcomponent = ReactTestUtils.renderIntoDocument(
			React.createElement(Overlay, {
				zIndexClass: zIndexClass,
				isShown: isShown,
				closeHandler: closeHandler,
				isForm: true,
				breadcrumb: breadcrumb,
			})
		);

		var telement = ReactDOM.findDOMNode(tcomponent);

		// console.log(telement.innerHTML);

		var closeIcon = telement.querySelector('.close-btn');
		expect(closeIcon)
			.not.toBeNull();

		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(tcomponent)
			.parentNode);
	});

	it('should call closeHandler in editing mode', function () {

		var tcomponent = ReactTestUtils.renderIntoDocument(
			React.createElement(Overlay, {
				zIndexClass: zIndexClass,
				isShown: isShown,
				closeHandler: closeHandler,
				isForm: true,
				breadcrumb: breadcrumb,
			})
		);

		var closeIcon = ReactTestUtils.findRenderedDOMComponentWithClass(tcomponent, 'close-btn');
		ReactTestUtils.Simulate.click(closeIcon);

		expect(closeHandler)
			.toBeCalled();

		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(tcomponent)
			.parentNode);

	});

	it('should display spinner when isLoading is true', function () {

		const wrapper = mount( <Overlay zIndexClass={zIndexClass}
										isShown={isShown}
										isLoading={true}
										closeHandler={closeHandler}
										isForm={true}
										breadcrumb={breadcrumb} />);

		expect(wrapper.find(Spinner).prop('show')).toBeTruthy();
	});

	it('should not display "unsaved changes" when hasUnsavedChanges not provided or false', function () {

		expect(element.querySelector('.close-btn .show'))
			.toBeNull();

		var tcomponent = ReactTestUtils.renderIntoDocument(
			React.createElement(Overlay, {
				zIndexClass: zIndexClass,
				isShown: isShown,
				isLoading: false,
				closeHandler: closeHandler,
				isForm: true,
				hasUnsavedChanges: false,
				breadcrumb: breadcrumb
			})
		);
		var telement = ReactDOM.findDOMNode(tcomponent);

		expect(element.querySelector('.close-btn .show'))
			.toBeNull();

		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(tcomponent)
			.parentNode);

	});

	it('should display "unsaved changes" when hasUnsavedChanges is true', function () {

		var tcomponent = ReactTestUtils.renderIntoDocument(
			React.createElement(Overlay, {
				zIndexClass: zIndexClass,
				isShown: isShown,
				isLoading: false,
				closeHandler: closeHandler,
				isForm: true,
				hasUnsavedChanges: true,
				breadcrumb: breadcrumb
			})
		);
		var telement = ReactDOM.findDOMNode(tcomponent);

		expect(telement.querySelector('.close-btn .show'))
			.not.toBeNull();

		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(tcomponent)
			.parentNode);

	});
});
