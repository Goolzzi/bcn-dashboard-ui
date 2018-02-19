let fakeSpin = require('../__testutils__/SpinnerTest')
	.default;

jest.setMock('../src/scripts/components/Spinner/Spinner', {
	default: fakeSpin
});

jest.dontMock('../src/scripts/components/Common/TextFieldGroup');
jest.dontMock('../src/scripts/components/Common/render');
jest.dontMock('../src/scripts/components/Spinner/Spinner');
jest.dontMock('../src/scripts/components/Spinner/render.jsx');

jest.mock('../src/scripts/logger/logger');
jest.dontMock('lodash');

describe('TextFieldGroup component tests', function () {

	let _ = require('lodash');
	let TextFieldGroup = require('../src/scripts/components/Common/TextFieldGroup')
		.default;
	let Spinner = require('../src/scripts/components/Spinner/Spinner')
		.default;

	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let naturalCompare = require('natural-compare-lite');
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut, element, onChangeCallback, onBlurCallback, disabledCallback;

	beforeEach(function () {
		onChangeCallback = jest.fn();
		onBlurCallback = jest.fn();
		disabledCallback = jest.fn();
	});


	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('should have render correct fields', function () {

		var value = 'test value';
		sut = ReactTestUtils.renderIntoDocument( < TextFieldGroup label = "Test Label"
			bcnID = "input-test"
			onChange = {
				onChangeCallback
			}
			value = {
				value
			}
			field = "test-name"
			type = "text" /> );

		element = ReactDOM.findDOMNode(sut);

		expect(element.querySelector('label')
				.textContent)
			.toEqual('Test Label');
		expect(element.querySelector('*[data-bcn-id="input-test"]'))
			.not.toBeNull();
		expect(element.querySelector('*[value="test value"]'))
			.not.toBeNull();
		expect(element.querySelector('*[name="test-name"]'))
			.not.toBeNull();
		expect(element.querySelector('*[type="text"]'))
			.not.toBeNull();

	});

	it('should render spinner when provided', function () {

		var inProcess = false;
		sut = ReactTestUtils.renderIntoDocument( < TextFieldGroup label = "Test Label"
			hasSpinner = {
				true
			}
			isInProcess = {
				inProcess
			}
			bcnID = "input-test"
			onChange = {
				onChangeCallback
			}
			value = {
				'test value'
			}
			field = "test-name"
			type = "text" />
		);

		element = ReactDOM.findDOMNode(sut);

		expect(element.querySelector('.inputbox-spinner'))
			.not.toBeNull();
	});


	it('should display error when set', function () {

		var inProcess = false;
		sut = ReactTestUtils.renderIntoDocument( < TextFieldGroup error = "This is an error"
			label = "Test Label"
			hasSpinner = {
				true
			}
			isInProcess = {
				inProcess
			}
			bcnID = "input-test"
			onChange = {
				onChangeCallback
			}
			value = {
				'test value'
			}
			field = "test-name"
			type = "text" />
		);

		element = ReactDOM.findDOMNode(sut);

		expect(element.querySelector('.help-block')
				.textContent)
			.toEqual('This is an error');
	});

});
