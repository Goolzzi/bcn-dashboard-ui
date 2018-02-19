jest.dontMock('../src/scripts/components/Toast/Toast');
jest.dontMock('../src/scripts/components/Toast/render.jsx');

describe('Toast component tests', function () {
	let Toast = require('../src/scripts/components/Toast')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let Toaster = require('../src/scripts/stores/Toaster')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;

	beforeEach(function () {
		Toaster.addChangeListener = jest.genMockFunction();
		Toaster.removeChangeListener = jest.genMockFunction();
		ToastActions.toastSettings = jest.genMockFunction();
		ToastActions.remove = jest.genMockFunction();
	});

	var generateToast = (id, type, text) => {
		return {
			id: id,
			type: type,
			text: text,
			duration: 8000,
			timerId: 'timer',
			fat: false
		};
	};

	var generateToasts = (num, type, offset = 0) => {
		var toasts = [];
		for (var x = 0; x < num; x++) {
			toasts.push(generateToast(x + offset, type, 'text' + (x + offset)));
		}
		return toasts;
	};

	var createProps = (toastLimit, enableFatToast = false, fatMessageText = '') => {
		return {
			toastLimit: toastLimit,
			enableFatToast: enableFatToast,
			fatToastMessage: fatMessageText
		};
	};

	var getRenderedToastInfo = (toastContainer) => {
		var toastElements = toastContainer.querySelectorAll('*[data-bcn-id^="toast-"]');
		var toasts = [];
		for (var x = 0; x < toastElements.length; x++) {
			var tokens = toastElements[x].getAttribute('data-bcn-id')
				.split('-');
			var element = toastElements[x];
			var text = element.querySelector('*[class="toast-message"]')
				.textContent;
			var closeButton = element.querySelector('*[class="toast-close-button"]');
			toasts.push({
				text: text,
				type: tokens[1],
				closeButton: closeButton,
				id: parseInt(tokens[2])
			});
		}

		return toasts;
	};

	it('should be mounted correctly', function () {
		Toaster.getMessages = function () {
			return [];
		};

		var sut = ReactTestUtils.renderIntoDocument(
			React.createElement(Toast, createProps(1))
		);

		var toastNode = ReactDOM.findDOMNode(sut);
		expect(toastNode.querySelector('*[id="toast-container"]'))
			.not.toBeNull();

		// called in componentDidMount
		expect(Toaster.addChangeListener)
			.toBeCalled();
	});

	it('should be unmounted correctly', function () {
		Toaster.getMessages = function () {
			return [];
		};

		var sut = ReactTestUtils.renderIntoDocument(
			React.createElement(Toast, createProps(1))
		);

		var toastNode = ReactDOM.findDOMNode(sut);
		ReactDOM.unmountComponentAtNode(toastNode.parentNode);

		// called in componentWillUnmount
		expect(Toaster.removeChangeListener)
			.toBeCalled();
	});

	it('should render toasts that exist in the store when mounted', function () {

		Toaster.getMessages = function () {
			return generateToasts(2, 'error');
		};

		var sut = ReactTestUtils.renderIntoDocument(
			React.createElement(Toast, createProps(2))
		);

		var toastNode = ReactDOM.findDOMNode(sut);
		var renderedToasts = getRenderedToastInfo(toastNode);

		expect(renderedToasts[0].type)
			.toEqual('error');
		expect(renderedToasts[0].text)
			.toEqual('text0');

		expect(renderedToasts[1].type)
			.toEqual('error');
		expect(renderedToasts[1].text)
			.toEqual('text1');
	});


	it('should call remove toast action when toast close clicked', function () {
		Toaster.getMessages = function () {
			return generateToasts(2, 'error');
		};

		var sut = ReactTestUtils.renderIntoDocument(
			React.createElement(Toast, createProps(2, true, 'fat'))
		);

		var toastNode = ReactDOM.findDOMNode(sut);
		var renderedToasts = getRenderedToastInfo(toastNode);
		ReactTestUtils.Simulate.click(renderedToasts[1].closeButton);
		expect(ToastActions.remove)
			.toBeCalledWith(renderedToasts[1].id);

		ReactTestUtils.Simulate.click(renderedToasts[0].closeButton);
		expect(ToastActions.remove)
			.toBeCalledWith(renderedToasts[0].id);
	});

	it('should update the message state after calling handle messages', function () {
		Toaster.getMessages = function () {
			return [];
		};

		var sut = ReactTestUtils.renderIntoDocument(
			React.createElement(Toast, createProps(true))
		);

		var toastNode = ReactDOM.findDOMNode(sut);

		Toaster.getMessages = function () {
			return generateToasts(2, 'error');
		};

		sut.handleMessages();

		var renderedToasts = getRenderedToastInfo(toastNode);
		expect(renderedToasts[0].type)
			.toEqual('error');
		expect(renderedToasts[0].text)
			.toEqual('text0');

		expect(renderedToasts[1].type)
			.toEqual('error');
		expect(renderedToasts[1].text)
			.toEqual('text1');
	});
});
