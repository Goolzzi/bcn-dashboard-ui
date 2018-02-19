jest.dontMock('../src/scripts/components/CommandBar/CommandBar.js');
jest.dontMock('../src/scripts/components/CommandBar/CommandBarPresenter.js');
jest.dontMock('../src/scripts/components/CommandBar/render.jsx');
jest.dontMock('classnames');

describe('CommandBar Component', function () {
	let CommandBar = require('../src/scripts/components/CommandBar')
		.default;
	let CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let Simulate = ReactTestUtils.Simulate;

	var component, element;

	beforeEach(function () {
		component = ReactTestUtils.renderIntoDocument(
			React.createElement(CommandBar, {
				presenter: CommandBarPresenter
			})
		);
		element = ReactDOM.findDOMNode(component);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(component)
			.parentNode);
	});

	it('should have class="CommandBar"', function () {
		expect(element.getAttribute('class')
				.indexOf('CommandBar'))
			.toBeGreaterThan(-1);
	});

	it('should create a list of groups of commands from a list of commands', function () {
		var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js');

		var availableCommands = CommandBarPresenter.availableCommands;
		var commandGroups = component.createCommandGroups(availableCommands);

		expect(commandGroups instanceof Array)
			.toBe(true);
		expect(commandGroups.length)
			.toBeGreaterThan(0);

		var commandCount = 0;
		commandGroups.forEach(group => {
			expect(group.commands instanceof Array)
				.toBe(true);
			expect(group.commands.length)
				.toBeGreaterThan(0);
			commandCount += group.commands.length;
		});
		expect(commandCount)
			.toEqual(availableCommands.length);
	});

	it('should show dropdown when input anything', function () {
		var input = element.querySelector('input.bar');
		expect(element.querySelector('.available-commands'))
			.toBeNull();
		input.value = '/';
		Simulate.change(input);
		expect(element.querySelector('.available-commands'))
			.not.toBeNull();
	});

	it('should select the first action when pressing down arrow', function () {
		var input = element.querySelector('input.bar');
		expect(element.querySelector('.available-commands'))
			.toBeNull();
		// Show dropdown
		input.value = '/';
		Simulate.change(input);
		var dropdown = element.querySelector('.available-commands');
		expect(dropdown)
			.not.toBeNull();
		// No action selected
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
		// Select first action
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(1);
		expect(dropdown.querySelectorAll('.command')[0])
			.toBe(dropdown.querySelectorAll('.command.highlighted')[0]);
	});

	it('should add space after /from when selecting /from and press enter', function () {
		var input = element.querySelector('input.bar');
		expect(element.querySelector('.available-commands'))
			.toBeNull();
		input.value = '/from';
		Simulate.change(input);
		var dropdown = element.querySelector('.available-commands');
		expect(dropdown)
			.not.toBeNull();
		// No action selected
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
		// Select first action
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});
		Simulate.keyDown(input, {
			key: 'Enter',
			keyCode: 13,
			which: 13
		});
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
		expect(input.value)
			.toBe('/from ');
	});

	it('should not change the text when typing "/from 0" and clicking on the suggestion', function () {
		var input = element.querySelector('input.bar');
		input.value = '/from 0';
		Simulate.change(input);
		var dropdown = element.querySelector('.available-commands');
		Simulate.click(dropdown.querySelectorAll('.command')[0]);
		expect(input.value)
			.toBe('/from 0');
	});

	it('should show error message when I call setErrorMsg', () => {
		expect(element.querySelector('.error-msg'))
			.toBeNull();
		component.setErrorMsg('INVALID_PARAMETER');
		expect(element.querySelector('.error-msg'))
			.not.toBeNull();
		expect(element.querySelector('.error-msg')
				.textContent)
			.not.toContain('unexpected');
	});

	it('should hide error when I call setSuggestedCommands with empty list', () => {
		expect(element.querySelector('.error-msg'))
			.toBeNull();
		component.setErrorMsg('INVALID_PARAMETER');
		expect(element.querySelector('.error-msg'))
			.not.toBeNull();
		component.setSuggestedCommands([]);
		expect(element.querySelector('.error-msg'))
			.toBeNull();
	});
});
