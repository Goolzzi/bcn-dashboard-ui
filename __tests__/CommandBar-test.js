const mockedPresenter = function (view, router) {
	this.onExecuteCommand = jest.genMockFunction();
	this.onNewCandidateCommand = jest.genMockFunction();
	this.onSelectingHighlightedCommand = jest.genMockFunction();
	this.onInvalidateActiveCommand = jest.genMockFunction();
	this.componentDidMount = jest.genMockFunction();
	this.componentWillUnmount = jest.genMockFunction();
	this.errorList = {};
	this.infomationList = {};
};
jest.dontMock('../src/scripts/components/CommandBar/CommandBar.js');
jest.dontMock('../src/scripts/components/CommandBar/render.jsx');
jest.dontMock('classnames');

describe('CommandBar View', function () {
	let CommandBar = require('../src/scripts/components/CommandBar')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let Simulate = ReactTestUtils.Simulate;

	var commandBarComponent, commandBarElement, commandBarPresenter;

	beforeEach(function () {
		commandBarComponent = ReactTestUtils.renderIntoDocument( < CommandBar presenter = {
				mockedPresenter
			}
			/>
		);
		commandBarElement = ReactDOM.findDOMNode(commandBarComponent);
		commandBarPresenter = commandBarComponent.state.presenter;
	});

	it('should have class="CommandBar"', function () {
		expect(commandBarElement.getAttribute('class')
				.indexOf('CommandBar'))
			.toBeGreaterThan(-1);
	});

	it('should have a presenter', function () {
		expect(commandBarPresenter)
			.toBeDefined();
		expect(commandBarPresenter)
			.not.toBeNull();
	});

	it('should call execute when I press enter', () => {
		var input = commandBarElement.querySelector('input.bar');
		Simulate.keyDown(input, {
			key: 'Enter',
			keyCode: 13,
			which: 13
		});
		expect(commandBarPresenter.onExecuteCommand)
			.toBeCalled();
	});

	it('should call execute when I type something and press enter', () => {
		var input = commandBarElement.querySelector('input.bar');
		input.value = '/logout';
		Simulate.keyDown(input, {
			key: 'Enter',
			keyCode: 13,
			which: 13
		});
		expect(commandBarPresenter.onExecuteCommand)
			.toBeCalledWith('/logout');
	});

	it('should show dropdown when I call setSuggestedCommands with nonempty list', () => {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
		commandBarComponent.setSuggestedCommands([{
			group_name: 'goo',
			command: 'foo',
			id: 'foo-id',
			description: 'bar'
        }]);
		expect(commandBarElement.querySelector('.available-commands'))
			.not.toBeNull();
	});

	it('should should include command and description in dropdown when I call setSuggestedCommands', () => {
		commandBarComponent.setSuggestedCommands([{
			group_name: 'goo',
			command: 'foo',
			id: 'foo-id',
			description: 'bar'
        }]);
		expect(commandBarElement.querySelector('.action')
				.textContent)
			.toBe('foo');
		expect(commandBarElement.querySelector('.description')
				.textContent)
			.toBe('bar');
	});

	it('should hide dropdown when I call setSuggestedCommands with empty list', () => {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
		commandBarComponent.setSuggestedCommands([{
			group_name: 'goo',
			command: 'foo',
			id: 'foo-id',
			description: 'bar'
        }]);
		expect(commandBarElement.querySelector('.available-commands'))
			.not.toBeNull();
		commandBarComponent.setSuggestedCommands([]);
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
	});

	it('should say something unexpected when I call setErrorMsg with invalid error code', () => {
		expect(commandBarElement.querySelector('.error-msg'))
			.toBeNull();
		commandBarComponent.setErrorMsg('NOT_A_REAL_ERROR_CODE');
		expect(commandBarElement.querySelector('.error-msg'))
			.not.toBeNull();
		expect(commandBarElement.querySelector('.error-msg')
				.textContent)
			.toContain('unexpected');
	});

	it('should hide suggestions when I call setErrorMsg', () => {
		commandBarComponent.setSuggestedCommands([{
			group_name: 'goo',
			command: 'foo',
			id: 'foo-id',
			description: 'bar'
        }]);
		expect(commandBarElement.querySelector('.action'))
			.not.toBeNull();
		commandBarComponent.setErrorMsg('INVALID_PARAMETER');
		expect(commandBarElement.querySelector('.action'))
			.toBeNull();
	});

	it('should not allow setSuggestedCommands(null)', () => {
		expect(() => commandBarComponent.setSuggestedCommands(null))
			.toThrow(new Error('NOT_ARRAY'));
	});

	it('should not allow setSuggestedCommands(undefined)', () => {
		expect(() => commandBarComponent.setSuggestedCommands(undefined))
			.toThrow(new Error('NOT_ARRAY'));
	});

	it('should not allow setSuggestedCommands("")', () => {
		expect(() => commandBarComponent.setSuggestedCommands(""))
			.toThrow(new Error('NOT_ARRAY'));
	});

	it('should not allow setErrorMsg(null)', () => {
		expect(() => commandBarComponent.setErrorMsg(null))
			.toThrow(new Error('NONEMPTY_STRING'));
	});

	it('should not allow setErrorMsg(undefined)', () => {
		expect(() => commandBarComponent.setErrorMsg(undefined))
			.toThrow(new Error('NONEMPTY_STRING'));
	});

	it('should not allow setErrorMsg({})', () => {
		expect(() => commandBarComponent.setErrorMsg({}))
			.toThrow(new Error('NONEMPTY_STRING'));
	});

	it('should not allow setErrorMsg("")', () => {
		expect(() => commandBarComponent.setErrorMsg(''))
			.toThrow(new Error('NONEMPTY_STRING'));
	});

	it('should call onNewCandidateCommand when I type slash', () => {
		var input = commandBarElement.querySelector('input.bar');
		input.value = '/';
		Simulate.change(input);
		expect(commandBarPresenter.onNewCandidateCommand)
			.toBeCalledWith('/', true);
	});

	it('should select the first action when pressing down arrow twice and then up arrow', function () {
		var input = commandBarElement.querySelector('input.bar');
		// Show dropdown
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);

		var dropdown = commandBarElement.querySelector('.available-commands');
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
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});
		// Not the first action selected
		expect(dropdown.querySelectorAll('.command')[0])
			.not.toBe(dropdown.querySelectorAll('.command.highlighted')[0]);
		Simulate.keyDown(input, {
			key: 'UpArrow',
			keyCode: 38,
			which: 38
		});
		// Not the first action selected
		expect(dropdown.querySelectorAll('.command')[0])
			.toBe(dropdown.querySelectorAll('.command.highlighted')[0]);
	});

	it('should do nothing on pressing up arrow', function () {
		var input = commandBarElement.querySelector('input.bar');
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
		// Pressing up arrow
		Simulate.keyDown(input, {
			key: 'UpArrow',
			keyCode: 38,
			which: 38
		});
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
	});

	it('should do nothing on pressing down arrow', function () {
		var input = commandBarElement.querySelector('input.bar');
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
		// Pressing down arrow
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
	});

	it('should not execute a command when I click on a suggestion', function () {
		var input = commandBarElement.querySelector('input.bar');
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);
		var dropdown = commandBarElement.querySelector('.available-commands');

		expect(commandBarPresenter.onExecuteCommand)
			.not.toBeCalled();
		Simulate.click(dropdown.querySelectorAll('.command')[0]);
		expect(commandBarPresenter.onExecuteCommand)
			.not.toBeCalled();
	});

	it('should call onSelectingHighlightedCommand when you click on a suggestion', function () {
		var input = commandBarElement.querySelector('input.bar');
		input.value = 'inputtext';
		Simulate.change(input);
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }]);
		var dropdown = commandBarElement.querySelector('.available-commands');

		Simulate.click(dropdown.querySelectorAll('.command')[0]);
		expect(commandBarPresenter.onSelectingHighlightedCommand)
			.toBeCalledWith('action1-id', 'inputtext');
	});

	it('should call onSelectingHighlightedCommand when you press down arrow and enter', function () {
		var input = commandBarElement.querySelector('input.bar');
		input.value = 'inputtext';
		Simulate.change(input);
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }]);

		// Pressing down arrow
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});

		// Pressing enter
		expect(commandBarPresenter.onExecuteCommand)
			.not.toBeCalled();
		Simulate.keyDown(input, {
			key: 'Enter',
			keyCode: 13,
			which: 13
		});
		expect(commandBarPresenter.onSelectingHighlightedCommand)
			.toBeCalledWith('action1-id', 'inputtext');
	});

	it('should not execute a command when I press down arrow and enter', function () {
		var input = commandBarElement.querySelector('input.bar');
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);
		var dropdown = commandBarElement.querySelector('.available-commands');

		// Pressing down arrow
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});

		// Pressing enter
		expect(commandBarPresenter.onExecuteCommand)
			.not.toBeCalled();
		Simulate.keyDown(input, {
			key: 'Enter',
			keyCode: 13,
			which: 13
		});
		expect(commandBarPresenter.onExecuteCommand)
			.not.toBeCalled();
	});

	it('should still respond to user input after you select an item', function () {
		var input = commandBarElement.querySelector('input.bar');
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);
		var dropdown = commandBarElement.querySelector('.available-commands');

		// Pressing down arrow
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});

		// Pressing enter
		Simulate.keyDown(input, {
			key: 'Enter',
			keyCode: 13,
			which: 13
		});

		input.value = '/something';
		Simulate.change(input);

		// Read back what we see in input bar
		expect(input.value)
			.toBe('/something');
	});

	it('should set the text when calling setText', function () {
		commandBarComponent.setText('wow');

		var input = commandBarElement.querySelector('input.bar');
		expect(input.value)
			.toBe('wow');

	});

	it('getting the border color of the commandBar', function () {
		var input = commandBarElement.querySelector('input.bar');
		// expect(input.classList).not.toContain('active');
		commandBarComponent.setActiveColor(true);
		expect(input.classList.contains('active'))
			.toBe(true, 'class list contains active');
		commandBarComponent.setActiveColor(false);
		expect(input.classList.contains('active'))
			.toBe(false, 'class list does not contain active');
	});

	it('should call onInvalidateActiveCommand when the user types something', function () {
		var input = commandBarElement.querySelector('input.bar');
		input.value = 'a';
		Simulate.change(input);
		expect(commandBarPresenter.onInvalidateActiveCommand)
			.toBeCalled();
	});

	it('sets text to empty and tells the presenter to clear filter and set suggestions on pressing escape', function () {
		var input = commandBarElement.querySelector('input.bar');
		input.value = '/l';
		Simulate.change(input);

		// Pressing escape
		Simulate.keyDown(input, {
			key: 'Escape',
			keyCode: 27,
			which: 27
		});

		expect(input.value)
			.toBe('');
		expect(commandBarPresenter.onInvalidateActiveCommand)
			.toBeCalled();
		expect(commandBarPresenter.onNewCandidateCommand)
			.toBeCalledWith('', true);
	});

	it('sets highlight when I mouse over', function () {
		var input = commandBarElement.querySelector('input.bar');
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);
		var dropdown = commandBarElement.querySelector('.available-commands');
		var suggestionElement = dropdown.querySelectorAll('.command')[0];

		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
		Simulate.mouseOver(suggestionElement);
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(1);
	});

	it('unsets highlight when I mouse out', function () {
		var input = commandBarElement.querySelector('input.bar');
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);
		var dropdown = commandBarElement.querySelector('.available-commands');
		var suggestionElement = dropdown.querySelectorAll('.command')[0];

		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
		Simulate.mouseOver(suggestionElement);
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(1);
		Simulate.mouseOut(suggestionElement);
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
	});

	it('should select the last action when pressing up arrow', function () {
		var input = commandBarElement.querySelector('input.bar');
		// Show dropdown
		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
        }, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
        }]);

		var dropdown = commandBarElement.querySelector('.available-commands');
		// No action selected
		expect(dropdown.querySelectorAll('.command.highlighted')
				.length)
			.toBe(0);
		// Select last action
		Simulate.keyDown(input, {
			key: 'UpArrow',
			keyCode: 38,
			which: 38
		});
		// Last action is selected
		expect(dropdown.querySelectorAll('.command')[1])
			.toBe(dropdown.querySelectorAll('.command.highlighted')[0]);
	});

	it('should suggest commands when error is displayed and you press down arrow', function () {
		var input = commandBarElement.querySelector('input.bar');
		input.value = '/';
		Simulate.change(input);
		commandBarComponent.setErrorMsg('Some error is displayed here');
		Simulate.keyDown(input, {
			key: 'DownArrow',
			keyCode: 40,
			which: 40
		});
		expect(commandBarPresenter.onNewCandidateCommand)
			.toBeCalledWith('/');
	});

	it('should suggest commands when error is displayed and you press up arrow', function () {
		var input = commandBarElement.querySelector('input.bar');
		input.value = '/';
		Simulate.change(input);
		commandBarComponent.setErrorMsg('Some error is displayed here');
		Simulate.keyDown(input, {
			key: 'UpArrow',
			keyCode: 38,
			which: 38
		});
		expect(commandBarPresenter.onNewCandidateCommand)
			.toBeCalledWith('/');
	});

	it('should show nothing when there are no suggestions', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([]);

		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();
	});

	it('should show one group, one command when there is one suggestion with displayable group', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([
			{
				group_name: 'action1',
				command: 'action1',
				id: 'action1-id',
				description: 'action1'
			}
		]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(1);

		expect(commandBarElement.querySelector('.command-group')
				.childElementCount)
			.toBe(2);
	});

	it('should show one command with no group when there is one suggestion with non-displayable group', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([
			{
				group_name: 'do-not-display',
				command: 'action1',
				id: 'action1-id',
				description: 'action1'
			}
		]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(1);

		expect(commandBarElement.querySelector('.command-group')
				.childElementCount)
			.toBe(1);
	});

	it('should show one group, multiple commands when suggestions include one group, multiple commands', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([{
			group_name: 'actions',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
		}, {
			group_name: 'actions',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
		}]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(1);

		expect(commandBarElement.querySelector('.command-group')
				.childElementCount)
			.toBe(3);
	});

	it('should show no group, multiple commands when suggestions include non-displayable group, multiple commands', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([{
			group_name: 'do-not-display',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
		}, {
			group_name: 'do-not-display',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
		}]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(1);

		expect(commandBarElement.querySelector('.command-group')
				.childElementCount)
			.toBe(2);
	});

	it('should show all groups and commands when suggestions include multiple groups and commands', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([{
			group_name: 'action1',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
		}, {
			group_name: 'action2',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
		}]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(2);

		expect(commandBarElement.querySelectorAll('.command-group')[0].childElementCount)
			.toBe(2);

		expect(commandBarElement.querySelectorAll('.command-group')[1].childElementCount)
			.toBe(2);
	});

	it('should show one group, multiple commands when suggestions include mixed group types', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([{
			group_name: 'actions',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
		}, {
			group_name: 'do-not-display',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
		}]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(2);

		expect(commandBarElement.querySelectorAll('.command-group')[0].childElementCount)
			.toBe(2);

		expect(commandBarElement.querySelectorAll('.command-group')[1].childElementCount)
			.toBe(1);
	});

	it('should show one group, multiple commands when suggestions include mixed group types - reversed', function () {
		expect(commandBarElement.querySelector('.available-commands'))
			.toBeNull();

		commandBarComponent.setSuggestedCommands([{
			group_name: 'do-not-display',
			command: 'action1',
			id: 'action1-id',
			description: 'action1'
		}, {
			group_name: 'actions',
			command: 'action2',
			id: 'action2-id',
			description: 'action2'
		}]);

		expect(commandBarElement.querySelector('.available-commands')
				.childElementCount)
			.toBe(2);

		expect(commandBarElement.querySelectorAll('.command-group')[0].childElementCount)
			.toBe(1);

		expect(commandBarElement.querySelectorAll('.command-group')[1].childElementCount)
			.toBe(2);
	});
});
