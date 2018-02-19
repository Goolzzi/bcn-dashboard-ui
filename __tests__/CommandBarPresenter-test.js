jest.dontMock('../src/scripts/components/CommandBar/CommandBarPresenter.js');

describe('CommandBar Presenter Test', function () {
	var sut;
	var suggestedCommandsList;
	var AuthActions;
	var CommandBar;
	var errorMessage;
	var FilterActions;
	var OverlayActions;
	var FilterStore;
	var reactRouter = {
		IamAGoodRouter: false
	};

	var expectNonEmptyList = () => {
		expect(CommandBar.setSuggestedCommands)
			.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.not.toBeCalled();
		expect(suggestedCommandsList.length)
			.toBeGreaterThan(0);
	};

	var expectEmptyList = () => {
		expect(suggestedCommandsList.length)
			.toBe(0);
		expect(CommandBar.setSuggestedCommands)
			.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.not.toBeCalled();
	};

	beforeEach(function () {
		// Mock CommandBar
		CommandBar = require('../src/scripts/components/CommandBar/CommandBar.js')
			.default;
		CommandBar.setSuggestedCommands = jest.genMockFunction()
			.mockImplementation(function (commands) {
				suggestedCommandsList = commands;
			});

		CommandBar.setErrorMsg = jest.genMockFunction()
			.mockImplementation(function (message) {
				errorMessage = message;
			});

		CommandBar.setText = jest.genMockFunction();
		CommandBar.setInfoMsg = jest.genMockFunction();
		CommandBar.setActiveColor = jest.genMockFunction();

		// Mock Actions
		AuthActions = require('../src/scripts/actions/AuthActions.js')
			.default;
		AuthActions.logout = jest.genMockFunction()
			.mockImplementation(function (args) {});

		FilterActions = require('../src/scripts/actions/FilterActions.js')
			.default;

		OverlayActions = require('../src/scripts/actions/OverlayActions.js')
			.default;

		OverlayActions.showSites = jest.genMockFunction();

		FilterStore = require('../src/scripts/stores/FilterStore.js')
			.default;

		var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js')
			.default;
		sut = new CommandBarPresenter(CommandBar, reactRouter);
	});

	it('should have onExecuteCommand', function () {
		expect(sut.onExecuteCommand)
			.toBeDefined();
	});

	it('should have onNewCandidateCommand', function () {
		expect(sut.onNewCandidateCommand)
			.toBeDefined();
	});

	it('should have onSelectingHighlightedCommand', function () {
		expect(sut.onSelectingHighlightedCommand)
			.toBeDefined();
	});

	it('should have onInvalidateActiveCommand', function () {
		expect(sut.onInvalidateActiveCommand)
			.toBeDefined();
	});

	it('should have componentDidMount', function () {
		expect(sut.componentDidMount)
			.toBeDefined();
	});

	it('should have componentWillUnmount', function () {
		expect(sut.componentWillUnmount)
			.toBeDefined();
	});

	it('should call FilterStore.addChangeListener when componentDidMount is called', function () {
		sut.componentDidMount();

		expect(FilterStore.addChangeListener)
			.toBeCalled();
	});

	it('should call FilterStore.removeChangeListener when componentWillUnmount is called', function () {
		sut.componentWillUnmount();

		expect(FilterStore.removeChangeListener)
			.toBeCalled();
	});

	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /log', function () {
		var filter = '/log';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call setErrorMsg when we call onNewCandidateCommand with /logout arg', function () {
		var filter = '/logout arg';
		sut.onNewCandidateCommand(filter);
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should call setErrorMsg when we call onNewCandidateCommand with /log + space', function () {
		var filter = '/log ';
		sut.onNewCandidateCommand(filter);
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should call setErrorMsg when we call onNewCandidateCommand with a non english command', function () {
		var filter = 'عربي';
		sut.onNewCandidateCommand(filter);
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should call setErrorMsg when we call onNewCandidateCommand with space + /logout arg', function () {
		var filter = ' /logout arg';
		sut.onNewCandidateCommand(filter);
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should call exception when we call onNewCandidateCommand with Null', function () {
		var filter = null;
		expect(() => sut.onNewCandidateCommand(filter))
			.toThrow(new Error('command is Null'));
	});

	it('should call view setSuggestedCommands with empty list when we call onNewCandidateCommand with empty filter', function () {
		var filter = '';
		sut.onNewCandidateCommand(filter);
		expectEmptyList();
	});

	it('should call view setSuggestedCommands when we call onNewCandidateCommand with space + /log', function () {
		var filter = ' /log';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands and all suggestions start with /log when we call onNewCandidateCommand with space + /log', function () {
		var filter = ' /log';
		sut.onNewCandidateCommand(filter);
		var doesntStartWithLog = (command) => {
			return !command.command.startsWith('/log');
		};
		expect(suggestedCommandsList.filter(doesntStartWithLog)
				.length)
			.toBe(0);
	});

	it('should call view setSuggestedCommands with empty list with /log when we call onNewCandidateCommand with /logout +space ', function () {
		var filter = '/logout ';
		sut.onNewCandidateCommand(filter);
		expectEmptyList();
	});

	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /LOG', function () {
		var filter = '/LOG';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands and all suggestions have a command and a description', function () {
		var filter = ' /log';
		sut.onNewCandidateCommand(filter);
		var hasCommandAndDescription = (command) => {
			expect(command.command)
				.toBeDefined();
			expect(command.description)
				.toBeDefined();
		};
		suggestedCommandsList.filter(hasCommandAndDescription);
	});

	it('should call view setErrorMsg when we call onNewCandidateCommand with Invalid command not starting with slash', function () {
		var filter = 'kjsahf';
		sut.onNewCandidateCommand(filter);
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should call view setErrorMsg when we call onNewCandidateCommand with Invalid command starting with slash', function () {
		var filter = '/kjsahf';
		sut.onNewCandidateCommand(filter);
		expect(CommandBar.setSuggestedCommands)
			.not.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
		expect(typeof CommandBar.setErrorMsg.mock.calls[0][0])
			.toBe('string');
	});

	it('should show Information when we call onNewCandidateCommand with many spaces', function () {
		var command = '     ';
		sut.onNewCandidateCommand(command);
		expect(CommandBar.setInfoMsg)
			.toBeCalled();
	});

	it('should show Information when executing many spaces command ', function () {
		var command = '     ';
		sut.onExecuteCommand(command);
		expect(CommandBar.setSuggestedCommands)
			.not.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.not.toBeCalled();
		expect(CommandBar.setInfoMsg)
			.not.toBeCalled();
	});

	it('should show Information when executing a space command ', function () {
		var command = ' ';
		sut.onExecuteCommand(command);
		expect(CommandBar.setSuggestedCommands)
			.not.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.not.toBeCalled();
		expect(CommandBar.setInfoMsg)
			.not.toBeCalled();
	});

	it('should not setErrorMsg on execute empty command', function () {
		var command = '';
		sut.onExecuteCommand(command);
		expect(CommandBar.setErrorMsg)
			.not.toBeCalled();
	});

	it('should call setSuggestedCommand with empty list on execute success', function () {
		var command = '/logout';
		sut.onExecuteCommand(command);
		expectEmptyList();
		expect(AuthActions.logout)
			.toBeCalled();
	});

	it('should not call AuthActions.logout on execute failed', function () {
		var command = '/lkhf';
		sut.onExecuteCommand(command);
		expect(AuthActions.logout)
			.not.toBeCalled();
	});

	it('should call setSuggestedCommand with empty list on execute with capitals', function () {
		var command = '/LOGOUT';
		sut.onExecuteCommand(command);
		expectEmptyList();
		expect(AuthActions.logout)
			.toBeCalled();
	});


	it('should set text to empty when calling /settings', function () {
		var command = '/settings';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.toBeCalledWith('');
	});


	it('should call view setSuggestedCommands and all suggestions start with /from when we call onNewCandidateCommand with /from ', function () {
		var filter = '/from ';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	// /from tests
	it('should call view setSuggestedCommands when we call onNewCandidateCommand with space + /fro', function () {
		var filter = ' /fro';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands and all suggestions start with /fro when we call onNewCandidateCommand with space + /fro', function () {
		var filter = ' /from';
		sut.onNewCandidateCommand(filter);
		var doesntStartWithLog = (command) => {
			return !command.command.startsWith('/fro');
		};
		expect(suggestedCommandsList.filter(doesntStartWithLog)
				.length)
			.toBe(0);
	});


	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /FR', function () {
		var filter = '/FR';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /from + arg', function () {
		var filter = '/from 00:00:01';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should set error when calling /from without argument', function () {
		var command = '/from';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.not.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should not set text to empty when calling /from', function () {
		var command = '/from 00:00:01';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.not.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.not.toBeCalled();
	});

	it('should set the active color when the filter store reports a non-null value', function () {
		FilterStore.getFilters = () => {
			return {
				from: 123
			};
		};
		sut._handleFilterChange();
		expect(CommandBar.setActiveColor)
			.toBeCalledWith(true);
	});

	it('should clear the active color when the filter store reports a null value', function () {
		FilterStore.getFilters = () => null;
		sut._handleFilterChange();
		expect(CommandBar.setActiveColor)
			.toBeCalledWith(false);
	});

	// /to tests
	it('should call view setSuggestedCommands when we call onNewCandidateCommand with space + /t', function () {
		var filter = ' /t';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands and all suggestions start with /t when we call onNewCandidateCommand with space + /t', function () {
		var filter = ' /t';
		sut.onNewCandidateCommand(filter);
		var doesntStartWithLog = (command) => {
			return !command.command.startsWith('/t');
		};
		expect(suggestedCommandsList.filter(doesntStartWithLog)
				.length)
			.toBe(0);
	});


	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /TO', function () {
		var filter = '/TO';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /to + arg', function () {
		var filter = '/to 23:55:15';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should not set text to empty when calling /to', function () {
		var command = '/to';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.not.toBeCalled();
	});

	// /at tests
	it('should call view setSuggestedCommands when we call onNewCandidateCommand with space + /a', function () {
		var filter = ' /a';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands and all suggestions start with /at when we call onNewCandidateCommand with space + /at', function () {
		var filter = ' /at';
		sut.onNewCandidateCommand(filter);
		var doesntStartWithLog = (command) => {
			return !command.command.startsWith('/at');
		};
		expect(suggestedCommandsList.filter(doesntStartWithLog)
				.length)
			.toBe(0);
	});


	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /At', function () {
		var filter = '/At';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should call view setSuggestedCommands when we call onNewCandidateCommand with /at + arg', function () {
		var filter = '/at 00:00:01';
		sut.onNewCandidateCommand(filter);
		expectNonEmptyList();
	});

	it('should not set text to empty when calling /at', function () {
		var command = '/at';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.not.toBeCalled();
	});

	it('should set text to empty when calling /sites', function () {
		var command = '/sites';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.toBeCalledWith('');
	});

	it('should set text to empty when calling /sitegroups', function () {
		var command = '/sitegroups';
		sut.onExecuteCommand(command);
		expect(CommandBar.setText)
			.toBeCalledWith('');
	});

	it('should validate time', function () {
		var command = '/from 02:23:02';
		sut.onNewCandidateCommand(command);
	});

	it('should accept valid times as valid', function () {
		var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js');
		var listOfValidTimes = [
        ];
		for (var i = 0; i < listOfValidTimes.length; i++) {
			var time = listOfValidTimes[i];
			expect(CommandBarPresenter.validateTime(false, time))
				.toBe(true);
		}
	});

	it('should set text to /from with space when selecting highlighted /from', function () {
		sut.onSelectingHighlightedCommand('/from', '/fr');
		expect(CommandBar.setText)
			.toBeCalledWith('/from ');
	});

	it('should not set text when it already starts /from', function () {
		sut.onSelectingHighlightedCommand('/from', '/from ');
		expect(CommandBar.setText)
			.not.toBeCalled();
	});

	it('should not set text when it already starts /from with arg', function () {
		sut.onSelectingHighlightedCommand('/from', '/from 00');
		expect(CommandBar.setText)
			.not.toBeCalled();
	});

	it('should not set text when it already starts /from with arg with spaces', function () {
		sut.onSelectingHighlightedCommand('/from', ' /from  00');
		expect(CommandBar.setText)
			.not.toBeCalled();
	});

	var listOfTimes = [
        '00:00:00', 'valid',
        '23:59:59', 'valid',
        '12:34:56', 'valid',
        '09:09:09', 'valid',
        '', 'partial',
        '0', 'partial',
        '00:00:0', 'partial',
        '12', 'partial',
        '1', 'partial',
        '2', 'partial',
        '23:', 'partial',
        '00:0', 'partial',
        '00:00', 'partial',
        '00:07', 'partial',
        '22:54:', 'partial',
        '00:43:5', 'partial',
        '00:0:', 'invalid',
        '0:00', 'invalid',
        '3', 'invalid',
        '24', 'invalid',
        '24:', 'invalid',
        '00:60', 'invalid',
        '00::', 'invalid',
        '00:6', 'invalid',
        '00:7', 'invalid',
        '00:43:6', 'invalid',
        '23:59:6', 'invalid',
        '00:60:00', 'invalid',
        '24:00:00', 'invalid',
        '-1:00:00', 'invalid',
        '00:-1:00', 'invalid',
        '00:00:-1', 'invalid',
        '-0:00:00', 'invalid',
        '00:-0:00', 'invalid',
        '00:00:-0', 'invalid',
        '0.:00:00', 'invalid',
        '00:0.:00', 'invalid',
        '00:00:0.', 'invalid',
        '.0:00:00', 'invalid',
        '00:.0:00', 'invalid',
        '00:00:.0', 'invalid',
        '::', 'invalid',
        '00:0:00', 'invalid',
        '0:00:00', 'invalid',
        '0:00:000', 'invalid',
        '23:60:59', 'invalid',
        '23:59:60', 'invalid',
        '00:00;00', 'invalid',
        '00;00;00', 'invalid',
        '00000000', 'invalid',
        '00::0:00', 'invalid',
        '00:00:000', 'invalid',
        '00:00:00:', 'invalid',
        '00:00:00x', 'invalid',
        '000:00:00', 'invalid',
        ':00:00:00', 'invalid',
        'x00:00:00', 'invalid',
        ' 00:00:00', 'invalid',
        'i', 'invalid',
        '00 :00 :00', 'invalid',
        '00:00:00 0', 'invalid',
        '0 ', 'invalid'
    ];

	var timeTestCase = function (time, opinion) {
		it('should regard the time ' + time + ' as ' + opinion, function () {
			// I use a timestamp to make sure the date stays fixed to the ms
			var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js');

			var validateResult = CommandBarPresenter.validateTime(false, time);
			var partialResult = CommandBarPresenter.validateTime(true, time);

			switch (opinion) {
			case 'valid':
				expect(validateResult)
					.toBe(true);
				expect(partialResult)
					.toBe(true);
				break;
			case 'partial':
				expect(validateResult)
					.toBe(false);
				expect(partialResult)
					.toBe(true);
				break;
			case 'invalid':
				expect(validateResult)
					.toBe(false);
				expect(partialResult)
					.toBe(false);
				break;
			default:
				expect(false)
					.toBe(true); //shouldn't happen if above list is formatted correctly
			}
		});
	};

	for (var i = 0; i < listOfTimes.length; i += 2) {
		timeTestCase(listOfTimes[i], listOfTimes[i + 1]);
	}

	var expectSuggestions = function (expectedSuggestions) {
		expectedSuggestions = expectedSuggestions.slice(0); // clone array because we will be modifying it
		var result = [];
		for (var i = 0; i < suggestedCommandsList.length; i++) {
			result.push(suggestedCommandsList[i].command);
		}
		result.sort();
		expectedSuggestions.sort();
		expect(result)
			.toEqual(expectedSuggestions);
	}

	var suggestionTestCase = function (command, expectedSuggestions) {
		it('should suggest [' + expectedSuggestions.toString() + '] for the command "' + command + '"', function () {
			suggestedCommandsList = ['error'];
			sut.onNewCandidateCommand(command);

			if (typeof expectedSuggestions === 'string') {
				expect(CommandBar.setErrorMsg)
					.toBeCalledWith(expectedSuggestions);
			} else {
				expectSuggestions(expectedSuggestions);
				expect(CommandBar.setErrorMsg)
					.not.toBeCalled();
			}
		});
	};

	var execTestCase = function (command, errorOnEnter) {
		it('should ' + (errorOnEnter ? '' : 'not ') + 'set error when executing command ' + command, function () {
			sut.onExecuteCommand(command);
			if (errorOnEnter) {
				expect(CommandBar.setErrorMsg)
					.toBeCalled();
			} else {
				expect(CommandBar.setErrorMsg)
					.not.toBeCalled();
			}
		});
	};

	var listOfCommandsAndSuggestions = [
        '', [], false,
        '/', ['/sites', '/at', '/from', '/to', '/logout', '/settings', '/site', '/sitegroups', '/policies', '/profile', '/domainlists'], true,
        ' /', ['/sites', '/at', '/from', '/to', '/logout', '/settings', '/site', '/sitegroups', '/policies', '/profile', '/domainlists'], true,
        '/ ', 'UNMATCHED_COMMAND', true,
        '/f', ['/from'], true,
        ' /f', ['/from'], true,
        '/from', ['/from'], true,
        ' /from', ['/from'], true,
        '/from ', ['/from'], true,
        '/from   ', ['/from'], true,
        ' /from ', ['/from'], true,
        '/from 0', ['/from'], true,
        '/from  0', ['/from'], true,
        '/from x', 'INVALID_PARAMETER', true,
        '/from 0 ', 'INVALID_PARAMETER', true,
        '/from 00: ', 'INVALID_PARAMETER', true,
        '/from 00:00:00', ['/from'], false,
        ' /from 00:00:00', ['/from'], false,
        '/from  00:00:00', ['/from'], false,
        '/from 00:00:00 0', 'INVALID_PARAMETER', true,
        '/to 00:00:00', ['/to'], false,
        '/from 00:00:00/to 00:00:00', 'INVALID_PARAMETER', true,
        '/from 00:00:00/', 'INVALID_PARAMETER', true,
        '/logout', ['/logout'], false,
        '/from0', 'UNMATCHED_COMMAND', true,
        '/from00:00:00', 'UNMATCHED_COMMAND', true,
        '/from 00:00:00 /to 00:00:00 /', ['/site'], true,
        '/from 00:00:00 /to 00:00:00 /to 00:00:00', 'UNMATCHED_COMMAND', true,
        '/from 00:00:00 /at', 'UNMATCHED_COMMAND', true,
        '/from 00:00:00 /at 00:00:00', 'UNMATCHED_COMMAND', true,
        '/from 00:00:00 /xxx', 'UNMATCHED_COMMAND', true,
        '/from 00:00:00 /from 00:00:00', 'UNMATCHED_COMMAND', true,
        '/to 00:00:01 /from 00:00:00', ['/from'], false,
        '/xxx', 'UNMATCHED_COMMAND', true,
        '/logout /from 00:00:00 ', 'UNMATCHED_COMMAND', true,
        '/logout /from 00:00:00 /to', 'UNMATCHED_COMMAND', true,
        '/logout /from 00:00:00 /to 00:00:00', 'UNMATCHED_COMMAND', true,
        '/xxx /from 00:00:00 ', 'UNMATCHED_COMMAND', true,
        '/to 00:00:00 ', ['/from', '/site'], false,
        '/from 00:00:00 ', ['/site', '/to'], false,
        '/from 00:00:00  ', ['/site', '/to'], false,
        '/from 00:00:00 /', ['/site', '/to'], true,
        '/from 00:00:00 /to 00:00:01', ['/to'], false,
        '/from 00:00:00 /to 00:00:01 ', ['/site'], false,
        '/from 00:00:00   /to 00:00:00 ', ['/site'], false,
        '/from 0 /to 00:00:00', 'INVALID_PARAMETER', true,
        '/logout ', [], false,
        '/F', ['/from'], true,
        '/fRoM', ['/from'], true,
        '/FROM ', ['/from'], true,
        '/from00:00:00 ', 'UNMATCHED_COMMAND', true,
        '/from00:00:00 /', 'UNMATCHED_COMMAND', true,
        '/xxx', 'UNMATCHED_COMMAND', true,
        '/logout /', 'UNMATCHED_COMMAND', true,
        'x', 'UNMATCHED_COMMAND', true,
        '/to 00:00:00 /', ['/from', '/site'], true,
        '/TO 00:00:00 ', ['/from', '/site'], false,
        '/fROm 00:00:00 ', ['/site', '/to'], false,
        '/from 00:00:00 /TO 00:00:0', ['/to'], true,
        '/from 00:00:00 /TO 00:00:00', ['/to'], false,
        '/from /to 00:00:00', 'INVALID_PARAMETER', true,
        '/from 00:00:00 /from 00:00:00 /to 00:00:00', 'UNMATCHED_COMMAND', true,
        '/from 00:00:00 /from 00:00:00 ', 'UNMATCHED_COMMAND', true,
        '/ /', 'UNMATCHED_COMMAND', true,
        '/ ', 'UNMATCHED_COMMAND', true,
        '/to 00:00:00 /from 0', ['/from'], true,
        '/to 00:00:00 /from 0 /', 'INVALID_PARAMETER', true

      //'/from 00:00:00 /to 00:00:00', ['/to'], true,
      //' /from 00:00:00 /to 00:00:00', ['/to'], true,
      //'/from 00:00:00 /to 00:00:00 ', [], true,
      //'/from 00:00:00   /to 00:00:00 ', [], true,
      //'/from 00:00:01 /to 00:00:00', ['/to'], true,
    ];

	for (var i = 0; i < listOfCommandsAndSuggestions.length; i += 3) {
		suggestionTestCase(listOfCommandsAndSuggestions[i], listOfCommandsAndSuggestions[i + 1]);
		execTestCase(listOfCommandsAndSuggestions[i], listOfCommandsAndSuggestions[i + 2]);
	}

	var suggestionsAfterFullCommands = function (allowed, command, expectedSuggestions) {
		it('should suggest [' + expectedSuggestions + '] for the full command "' + command + '"', function () {
			var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js');

			var result = CommandBarPresenter.SuggestionsAfterFullCommand(command, allowed);

			if (expectedSuggestions === null) {
				expect(result)
					.toBe(null);
			} else {
				expect(result)
					.not.toBe(null);
				result.sort();
				expectedSuggestions.sort();
				expect(result)
					.toEqual(expectedSuggestions);
			}
		});
	};

	var suggestionsAfterPartialCommands = function (allowed, command, expectedSuggestions) {
		it('should suggest [' + expectedSuggestions + '] for the partial command "' + command + '"', function () {
			var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js');

			var result = CommandBarPresenter.SuggestionsAfterPartialCommand(command, allowed);

			if (expectedSuggestions === null) {
				expect(result)
					.toBe(null);
			} else {
				expect(result)
					.not.toBe(null);
				result.sort();
				expectedSuggestions.sort();
				expect(result)
					.toEqual(expectedSuggestions);
			}
		});
	};

	var all = ['/sites', '/at', '/from', '/to', '/logout', '/settings', '/site', '/domain-name-patterns', '/profile'];

	var listOfFullOrPartialCommands = [
        all, '', [], null,
        all, ' ', ['/sites', '/at', '/from', '/to', '/logout', '/profile', '/settings', '/site'], null,
        all, '/', ['/sites', '/at', '/from', '/to', '/logout', '/profile', '/settings', '/site'], null,
        all, ' /', ['/sites', '/at', '/from', '/to', '/logout', '/profile', '/settings', '/site'], null,
        all, '/ ', null, null,
        all, '/f', ['/from'], null,
        all, ' /f', ['/from'], null,
        all, '/from', ['/from'], null,
        all, ' /from', ['/from'], null,
        all, '/from ', ['/from'], null,
        all, '/from   ', ['/from'], null,
        all, ' /from ', ['/from'], null,
        all, '/from 0', ['/from'], null,
        all, '/from  0', ['/from'], null,
        all, '/from x', null, null,
        all, '/from 0 ', null, null,
        all, '/from 00: ', null, null,
        all, '/from 00:00:00', ['/from'], ['/site', '/to'],
        all, ' /from 00:00:00', ['/from'], ['/site', '/to'],
        all, '/from  00:00:00', ['/from'], ['/site', '/to'],
        all, '/from 00:00:00 0', null, null,
        all, '/to 00:00:00', ['/to'], ['/from', '/site'],
        all, '/from 00:00:00/to 00:00:00', null, null,
        all, '/from 00:00:00/', null, null,
        all, '/logout', ['/logout'], [],
        all, '/from0', null, null,
        all, '/from00:00:00', null, null,
        all, '/xxx', null, null,
        all, '/to 00:00:00 ', ['/from', '/site'], ['/from', '/site'],
        all, '/from 00:00:00 ', ['/site', '/to'], ['/site', '/to'],
        all, '/from 00:00:00  ', ['/site', '/to'], ['/site', '/to'],
        all, '/site aaax ', ['/from', '/to', '/at'], ['/from', '/to', '/at'],
        all, '/site ', ['/site'], null,
        all, '/logout ', [], [],
        all, '/a', ['/at'], null,
        [], '/', null, null,
        [], '/from 00:00:00', null, null,
        [], '/from 00:00:00 ', null, null,
        [], '', [], null,
        ['/to'], '/', ['/to'], null,
        ['/to'], '/f', null, null,
        ['/to'], '/from 00:00:00', null, null,
        ['/to'], '/from 00:00:00 ', null, null
    ];
	for (var i = 0; i < listOfFullOrPartialCommands.length; i += 4) {
		suggestionsAfterPartialCommands(listOfFullOrPartialCommands[i], listOfFullOrPartialCommands[i + 1], listOfFullOrPartialCommands[i + 2]);
		suggestionsAfterFullCommands(listOfFullOrPartialCommands[i], listOfFullOrPartialCommands[i + 1], listOfFullOrPartialCommands[i + 3]);
	}

	var suggestionClickTestCase = function (originalText, whatWeClickedOn, newText) {
		it('should set text to "' + newText + '" when we click on "' + whatWeClickedOn + '" and original text was "' + originalText + '"', function () {
			var CommandBarPresenter = require('../src/scripts/components/CommandBar/CommandBarPresenter.js');
			var expectedSuggestions = CommandBarPresenter.suggestionsAfterChainedCommands(newText);

			sut.onSelectingHighlightedCommand(whatWeClickedOn, originalText);
			if (newText != originalText) {
				expect(CommandBar.setText)
					.toBeCalledWith(newText);
				expect(CommandBar.setSuggestedCommands)
					.toBeCalled();
				expectSuggestions(expectedSuggestions);
			} else {
				expect(CommandBar.setText)
					.not.toBeCalled();
				expect(CommandBar.setSuggestedCommands)
					.not.toBeCalled();
			}
			expect(CommandBar.setErrorMsg)
				.not.toBeCalled();
		});
	};

	var listOfSuggestionClicks = [
        ' ', '/logout', ' /logout',
        ' ', '/from', ' /from ',
        '   ', '/from', '   /from ',
        '/', '/logout', '/logout',
        '/', '/from', '/from ',
        '/', '/at', '/at ',
        '/', '/sites', '/sites ',
        '/', '/settings', '/settings',
        '/', '/to', '/to ',
        ' /', '/logout', ' /logout',
        ' /', '/from', ' /from ',
        '/f', '/from', '/from ',
        '/a', '/at', '/at ',
        '/s', '/sites', '/sites ',
        '/t', '/to', '/to ',
        '/set', '/settings', '/settings',
        ' /f', '/from', ' /from ',
        '/logout', '/logout', '/logout',
        '/from', '/from', '/from ',
        ' /from', '/from', ' /from ',
        '/from ', '/from', '/from ',
        ' /from ', '/from', ' /from ',
        '/from 2', '/from', '/from 2',
        '/from 00:', '/from', '/from 00:',
        ' /from 00:', '/from', ' /from 00:',
        '/at 00:', '/at', '/at 00:',
        '/from 00:00:00', '/from', '/from 00:00:00',
        '   /from 00:00:00', '/from', '   /from 00:00:00',
        '/from 00:00:00 ', '/to', '/from 00:00:00 /to ',
        '/from 00:00:00   ', '/to', '/from 00:00:00   /to ',
        '  /from 00:00:00 ', '/to', '  /from 00:00:00 /to ',
        '/from 00:00:00 /', '/to', '/from 00:00:00 /to ',
        '  /from 00:00:00 /', '/to', '  /from 00:00:00 /to ',
        '/from 00:00:00   /t', '/to', '/from 00:00:00   /to ',
        '/from 00:00:00 /to', '/to', '/from 00:00:00 /to ',
        '  /from 00:00:00 /to', '/to', '  /from 00:00:00 /to ',
        '/from 00:00:00 /to ', '/to', '/from 00:00:00 /to ',
        '  /from 00:00:00 /to ', '/to', '  /from 00:00:00 /to ',
        '/from 00:00:00 /to 12:', '/to', '/from 00:00:00 /to 12:',
        '  /from 00:00:00 /to 12:', '/to', '  /from 00:00:00 /to 12:',
        '/from 00:00:00 /to 12:34:56', '/to', '/from 00:00:00 /to 12:34:56',
        '  /from 00:00:00 /to 12:34:56', '/to', '  /from 00:00:00 /to 12:34:56',
        '/from 00:00:00   /to 0', '/to', '/from 00:00:00   /to 0',
        '/F', '/from', '/from ', // if we're adding any characters, we also change the last command to lowercase
        '/A', '/at', '/at ',
        '/S', '/sites', '/sites ',
        '/T', '/to', '/to ',
        '/SET', '/settings', '/settings',
        ' /F', '/from', ' /from ',
        '/LoGoUt', '/logout', '/LoGoUt',
        '/FRom', '/from', '/from ',
        ' /FRom', '/from', ' /from ',
        '/frOm ', '/from', '/frOm ',
        ' /from ', '/from', ' /from ',
        '/FROM 2', '/from', '/FROM 2',
        '/FROM 00:', '/from', '/FROM 00:',
        ' /FROM 00:', '/from', ' /FROM 00:',
        '/At 00:', '/at', '/At 00:',
        '/fRom 00:00:00', '/from', '/fRom 00:00:00',
        '   /fRom 00:00:00', '/from', '   /fRom 00:00:00',
        '/frOM 00:00:00 ', '/to', '/frOM 00:00:00 /to ',
        '  /frOM 00:00:00 ', '/to', '  /frOM 00:00:00 /to ',
        '/frOM 00:00:00 /', '/to', '/frOM 00:00:00 /to ',
        '  /frOM 00:00:00 /', '/to', '  /frOM 00:00:00 /to ',
        '/frOM 00:00:00 /T', '/to', '/frOM 00:00:00 /to ',
        '/frOM 00:00:00 /To', '/to', '/frOM 00:00:00 /to ',
        '  /frOM 00:00:00 /TO', '/to', '  /frOM 00:00:00 /to ',
        '/frOM 00:00:00 /To ', '/to', '/frOM 00:00:00 /To ',
        '  /frOM 00:00:00 /To ', '/to', '  /frOM 00:00:00 /To ',
        '/frOM 00:00:00 /To 12:34:56', '/to', '/frOM 00:00:00 /To 12:34:56',
        '/s', '/site', '/site ',
    ];
	for (var i = 0; i < listOfSuggestionClicks.length; i += 3) {
		suggestionClickTestCase(listOfSuggestionClicks[i], listOfSuggestionClicks[i + 1], listOfSuggestionClicks[i + 2]);
	}

	it('should call filter delete when active command is invalidated', function () {
		sut.onInvalidateActiveCommand();
		expect(FilterActions.deleteFilters)
			.toBeCalled();
	});

	it('should call filter delete when attempting to execute an empty command', function () {
		sut.onExecuteCommand('');
		expect(FilterActions.deleteFilters)
			.toBeCalled();
	});

	it('should call filter delete when attempting to execute an invalid command', function () {
		sut.onExecuteCommand('/xxxxz');
		expect(FilterActions.deleteFilters)
			.toBeCalled();
	});

	it('should call filter delete when executing any valid command', function () {
		sut.onExecuteCommand('/logout');
		expect(FilterActions.deleteFilters)
			.toBeCalled();
	});

	it('should call filter delete when executing a filter command', function () {
		sut.onExecuteCommand('/from 00:00:00');
		expect(FilterActions.deleteFilters)
			.toBeCalled();
	});

	it('should call SiteActions.show with input router when executing add-sites', function () {
		sut.onExecuteCommand('/sites');
		expect(OverlayActions.showSites)
			.toBeCalledWith(reactRouter, null);
	});

	it('should call FilterActions.from with specified time', function () {
		sut.onExecuteCommand('/from 12:34:56');
		expect(FilterActions.from)
			.toBeCalledWith('12:34:56');
	});

	it('should call FilterActions.from with specified time with spaces trimmed', function () {
		sut.onExecuteCommand('  /from    12:34:56  ');
		expect(FilterActions.from)
			.toBeCalledWith('12:34:56');
	});

	it('should not call FilterActions.from with invalid time', function () {
		sut.onExecuteCommand('/from 24:09:00');
		expect(FilterActions.from)
			.not.toBeCalled();
	});

	it('should call FilterActions.to with specified time', function () {
		sut.onExecuteCommand('/to 12:34:56');
		expect(FilterActions.to)
			.toBeCalledWith('12:34:56');
	});

	it('should call FilterActions.at with specified time', function () {
		sut.onExecuteCommand('/at 12:34:56');
		expect(FilterActions.at)
			.toBeCalledWith('12:34:56');
	});

	it('should set error when FilterActions.from throws error', function () {
		FilterActions.from.mockImplementation(() => {
			throw 'foo'
		});
		sut.onExecuteCommand('  /from    12:34:56  ');
		expect(FilterActions.from)
			.toBeCalled();
		expect(CommandBar.setErrorMsg)
			.toBeCalled();
	});

	it('should not call FilterActions.to when FilterActions.from throws error', function () {
		FilterActions.from.mockImplementation(() => {
			throw 'foo'
		});
		sut.onExecuteCommand('/from 12:34:56 /to 12:34:57');
		expect(FilterActions.from)
			.toBeCalled();
		expect(FilterActions.to)
			.not.toBeCalled();
	});

	it('should not call FilterActions.from when a syntactically invalid command comes after', function () {
		sut.onExecuteCommand('/from 12:34:56 /');
		expect(FilterActions.from)
			.not.toBeCalled();
	});

});
