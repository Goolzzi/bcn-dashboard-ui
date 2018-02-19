/**
 * Command Bar Presenter
 */

import FilterStore from '../../stores/FilterStore';
import AuthActions from '../../actions/AuthActions';
import SettingsActions from '../../actions/SettingsActions';
import FilterActions from '../../actions/FilterActions';
import OverlayActions from '../../actions/OverlayActions';

var actions = {
	AuthActions: AuthActions,
	SettingsActions: SettingsActions,
	FilterActions: FilterActions,
	OverlayActions: OverlayActions
};

var availableCommands = [
	{
		'group_name': 'general',
		'command': '/sites',
		'name': 'Sites',
		'description': 'Manage Sites',
		'actionGroup': 'OverlayActions',
		'action': 'showSites',
		'clearOnExecute': true,
		'includeRouter': true,
		'arg': false,
		'allowedChain': []
}, {
		'group_name': 'general',
		'command': '/sitegroups',
		'name': 'Site Groups',
		'description': 'Manage Site Groups',
		'actionGroup': 'OverlayActions',
		'action': 'showSiteGroups',
		'clearOnExecute': true,
		'includeRouter': true,
		'arg': false,
		'allowedChain': []
}, {
		'group_name': 'general',
		'command': '/policies',
		'name': 'Policies',
		'description': 'Manage Policies',
		'actionGroup': 'OverlayActions',
		'action': 'showPolicies',
		'clearOnExecute': true,
		'includeRouter': true,
		'arg': false,
		'allowedChain': []
}, {
		'group_name': 'general',
		'command': '/profile',
		'name': 'Profile',
		'description': 'Customer Profile',
		'actionGroup': 'UserActions',
		'action': 'showProfile',
		'clearOnExecute': true,
		'arg': false,
		'includeRouter': true,
		'allowedChain': []
}, {
		'group_name': 'general',
		'command': '/domainlists',
		'name': 'Domain Lists',
		'description': 'Manage Domain Lists',
		'actionGroup': 'OverlayActions',
		'action': 'showDomainLists',
		'clearOnExecute': true,
		'includeRouter': true,
		'arg': false,
		'allowedChain': []
}, {
		'group_name': 'general',
		'command': '/settings',
		'name': 'Settings',
		'description': 'Settings for customer UI',
		'actionGroup': 'SettingsActions',
		'action': 'show',
		'clearOnExecute': true,
		'arg': false,
		'allowedChain': []
}, {
		'group_name': 'general',
		'command': '/logout',
		'name': 'Log out',
		'description': 'Log out of customer UI',
		'actionGroup': 'AuthActions',
		'action': 'logout',
		'clearOnExecute': true,
		'arg': false,
		'allowedChain': []
}, {
		'group_name': 'filter',
		'command': '/from',
		'parameters': 'HH:MM:SS',
		'name': 'Filter From',
		'description': 'e.g. /from 00:01:55',
		'actionGroup': 'FilterActions',
		'action': 'from',
		'clearOnExecute': false,
		'arg': true,
		'argType': 'TIME',
		'allowedChain': ['/to', '/site']
}, {
		'group_name': 'filter',
		'command': '/to',
		'parameters': 'HH:MM:SS',
		'name': 'Filter From',
		'description': 'e.g. /to 21:56:22',
		'actionGroup': 'FilterActions',
		'action': 'to',
		'clearOnExecute': false,
		'arg': true,
		'argType': 'TIME',
		'allowedChain': ['/from', '/site']
}, {
		'group_name': 'filter',
		'command': '/at',
		'parameters': 'HH:MM:SS',
		'name': 'Filter From',
		'description': 'e.g. /at 09:01:55',
		'actionGroup': 'FilterActions',
		'action': 'at',
		'clearOnExecute': false,
		'arg': true,
		'argType': 'TIME',
		'allowedChain': ['/site']
}, {
		'group_name': 'filter',
		'command': '/site',
		'parameters': 'SiteName',
		'name': 'Site',
		'description': 'e.g. /site TorontoQueenStreet',
		'actionGroup': 'FilterActions',
		'action': 'site',
		'clearOnExecute': false,
		'arg': true,
		'argType': 'SITE_NAME',
		'allowedChain': ['/from', '/to', '/at']
}];

var errorMessage;

function SuggestionsAfterFullCommand(commandString, listOfCurrentAvailableCommands) {
	var command = getCommand(commandString);
	if (command === null || listOfCurrentAvailableCommands.indexOf(command.command) === -1) {
		errorMessage = 'UNMATCHED_COMMAND';
		return null;
	}
	var commandArg = getCommandArg(commandString);
	if ((command.arg && commandArg == null)) {
		errorMessage = 'INVALID_PARAMETER';
		return null;
	} else if ((!command.arg && commandArg != null)) {
		errorMessage = 'EXTRA_PARAMETER';
		return null;
	} else {
		if (command.arg) {
			// Validate arguments
			var validArg = validateArg(false, command.argType, commandArg.trimLeft());
			if (!validArg) {
				return null;
			}
		}

		return command.allowedChain;
	}
}

function SuggestionsAfterPartialCommand(commandString, listOfCurrentAvailableCommands) {
	var filterByCommand = (command) => {
		var cmd = removeCommandArg(commandString);
		var arg = getCommandArg(commandString);
		if (!command.command.startsWith(commandString.toLowerCase()
				.trimLeft()) && command.command !== (cmd.toLowerCase()
				.trim())) {
			return false;
		}
		if (listOfCurrentAvailableCommands.indexOf(command.command) === -1) {
			return false;
		} else if (command.arg && arg != null) {
			return validateArg(true, command.argType, arg.trimLeft());
		} else if (!command.arg && arg != null) {
			return false;
		} else {
			return true;
		}

	};
	if (commandString == '') {
		return [];
	} else if (SuggestionsAfterFullCommand(commandString, listOfCurrentAvailableCommands) && commandString.endsWith(' ')) {
		return SuggestionsAfterFullCommand(commandString, listOfCurrentAvailableCommands);
	} else {
		var filteredList = availableCommands.filter(filterByCommand);
		if (filteredList.length === 0) {
			return null;
		} else {
			return filteredList.map((command) => command.command);
		}
	}
}

function getCommandByName(command) {
	var filterCommand = (listElement) => {
		return listElement.command === (command.toLowerCase()
			.trim());
	};
	var findCommand = availableCommands.filter(filterCommand);
	if (findCommand.length > 0) {
		return findCommand[0];
	} else {
		return null;
	}
}

const getCommand = (commandWithArg) => {
	var command = removeCommandArg(commandWithArg);
	if (validateForm(command)) {
		return getCommandByName(command);
	}
};


function parseCommands(commands) {
	commands = commands.trimLeft();
	if (commands === '') {
		return null;
	}
	return commands.split(/(?= \/)/);
}

function validateForm(command) {
	if (command == null) {
		throw new Error('command is Null');
		return false;
	} else {
		return true;
	}
}

function removeCommandArg(commandWithArg) {
	var firstSpaceIndex = commandWithArg.trimLeft()
		.indexOf(' ');
	if (firstSpaceIndex === -1) {
		// no arg
		return commandWithArg.trimLeft();
	} else {
		return commandWithArg.trimLeft()
			.substring(0, firstSpaceIndex);;
	}
}

function getCommandArg(commandWithArg) {
	var firstSpaceIndex = commandWithArg.trimLeft()
		.indexOf(' ');
	var arg = commandWithArg.trimLeft()
		.substring(firstSpaceIndex + 1);
	if (firstSpaceIndex === -1 || arg.trim() === '') {
		// no arg
		return null;
	} else {
		return arg;
	}
}

function isCommandAcceptArg(commandWithArg) {
	var filterCommandWithArg = (command) => {
		return commandWithArg.toLowerCase()
			.trimLeft()
			.startsWith(command.command) && command.arg;
	};

	return availableCommands.filter(filterCommandWithArg)
		.length > 0;
}

function validateArg(partial, type, arg) {
	switch (type) {
	case 'TIME':
		return validateTime(partial, arg);
	case 'SITE_NAME':
		return true;
	default:
		return false;
	}
}

function validateTime(partial, time) {
	if (partial) {
		return validateCompleteTime(time) || validatePartialTime(time);
	} else {
		return validateCompleteTime(time);
	}
}

function validateCompleteTime(time) {
	time = time.trimRight();
	var isValid = (time.search(/^\d{2}:\d{2}:\d{2}$/) !== -1) &&
		(time.substr(0, 2) >= 0 && time.substr(0, 2) <= 23) &&
		(time.substr(3, 2) >= 0 && time.substr(3, 2) <= 59) &&
		(time.substr(6, 2) >= 0 && time.substr(6, 2) <= 59);

	if (isValid) {
		return true;
	} else {
		errorMessage = 'INVALID_PARAMETER';
		return false;
	}
}

function validatePartialTime(time) {
	if (!/^(\d(\d(:(\d(\d(:(\d\d?)?)?)?)?)?)?)?$/.test(time)) {
		return false;
	}
	if (time !== '') {
		var hours = time.split(':')[0];
		var minutes = time.split(':')[1];
		var seconds = time.split(':')[2];

		// Hours
		if ((hours.length === 1 && parseInt(hours) > 2) || parseInt(hours) > 23) {
			return false;
		}

		// Minutes
		if (undefined !== minutes && minutes !== '') {
			if ((minutes.length === 1 && parseInt(minutes) > 5) || parseInt(minutes) > 59) {
				return false;
			}
		}

		// Seconds
		if (undefined !== seconds && seconds !== '') {
			if ((seconds.length === 1 && parseInt(seconds) > 5) || parseInt(seconds) > 59) {
				return false;
			}
		}
	}
	return true;
}

function suggestionsAfterChainedCommands(inputString) {
	var currentAvailableCommands = availableCommands.map((command) => command.command);
	if (inputString === null || inputString === undefined) {
		throw new Error('command is Null');
	} else if (inputString === '') {
		return [];
	} else if (inputString.trim() === '') {
		return currentAvailableCommands;
	} else {
		var chainOfCommands = parseCommands(inputString);
		for (var i = 0; i < chainOfCommands.length - 1; i++) {
			var suggestions = SuggestionsAfterFullCommand(chainOfCommands[i], currentAvailableCommands);

			if (suggestions === null) {
				return null;
			}
			currentAvailableCommands = suggestions;
		}

		var suggestions = SuggestionsAfterPartialCommand(chainOfCommands[chainOfCommands.length - 1], currentAvailableCommands);

		//remove previously entered commands from the allowed chain of commands
		for (var i = 0; i < chainOfCommands.length - 1; i++) {
			var currCommand = removeCommandArg(chainOfCommands[i]);
			if (suggestions !== null) {
				for (var j = 0; j < suggestions.length; j++) {
					if (suggestions[j] === currCommand) {
						suggestions[j] = undefined;
					}
				}
			}
		}
		return suggestions;
	}
}

function includeId(obj) {
	return Object.assign({
		id: obj.command
	}, obj);
}


const CommandBarPresenter = function (view, router) {
	this.errorList = {
		UNKNOWN_SUGGESTING: 'An unknown error occurred when suggesting commands.',
		UNKNOWN_EXECUTING: 'An unknown error occurred when executing commands.',
		UNMATCHED_COMMAND: 'Could not find matching command. Enter / for a list of supported commands.',
		INVALID_PARAMETER: 'Parameter not valid. Please check syntax and try again.',
		EXTRA_PARAMETER: 'Command does not accept parameters.',
		FUTURE_TIME: 'Cannot fetch data for a future time. Please check time value(s).',
		TO_FROM_TIME: '/to cannot occur before /from. Please check time value(s)',
		NONEMPTY_FILTER: 'Duplicate commands',
		UNPARSEABLE_TIME: 'Could not parse time',
		NONEMPTY_STRING: 'errorCode is not a nonempty String',
		NOT_ARRAY: 'commands is not an Array',
		BACKEND_ERROR: 'Something went wrong. Please try again or contact your administrator.'
	};

	this.informationList = {
		TO_SHOW_COMMANDS: 'Enter / for a list of supported commands'
	};
	this.view = view;
	this.router = router;
	this.defaultMessage = 'Enter / for a list of supported commands';

	this.onExecuteCommand = (command) => {
		errorMessage = 'UNKNOWN_EXECUTING';
		FilterActions.deleteFilters();
		if (command.trim() === '') {
			// Do nothing
			//  view.setErrorMsg('There was an error executing your command.');
		} else {
			if (this._executeCommand(command)) {
				view.setSuggestedCommands([]);
			} else {
				// Show error message in view
				view.setErrorMsg(errorMessage);
			}
		}
	};

	this._executeCommand = (commandString) => {
		var chainOfCommands = parseCommands(commandString);
		if (chainOfCommands === null || chainOfCommands.length === 0) {
			return false;
		}

		var currentAvailableCommands = availableCommands.map((command) => command.command);
		for (var i = 0; i < chainOfCommands.length; i++) {
			var suggestions = SuggestionsAfterFullCommand(chainOfCommands[i], currentAvailableCommands);
			if (suggestions === null) {
				return false;
			}
			currentAvailableCommands = suggestions;
		}

		// Clean any previous command parameters
		for (var key in actions) {
			if (actions.hasOwnProperty(key) && (typeof actions[key].resetParams === 'function')) {
				actions[key].resetParams();
			}
		}

		var clearOnExecute = false;
		for (var i = 0; i < chainOfCommands.length; i++) {
			var command = getCommand(chainOfCommands[i]);
			var commandArg = getCommandArg(chainOfCommands[i]);
			if (commandArg !== null) {
				commandArg = commandArg.trim();
			}

			if (command.clearOnExecute) {
				clearOnExecute = true;
			}

			try {
				//actions[command.action].setArguments(commandArg);
				if (actions[command.actionGroup].hasOwnProperty(command.action)) {
					if (command.hasOwnProperty('includeRouter')) {
						actions[command.actionGroup][command.action](this.router, commandArg);
					} else {
						actions[command.actionGroup][command.action](commandArg);
					}
				}
			} catch (err) {
				errorMessage = err.message;
				return false;
			}
		}

		// Apply any accumulated commands
		for (var key in actions) {
			if (actions.hasOwnProperty(key) && (typeof actions[key].executeAction === 'function')) {
				// Execute action and save command
				actions[key].executeAction(commandString);
			}
		}

		// Remove commands from command bar if required
		if (clearOnExecute) {
			view.setText('');
		}

		return true;
	};

	this.onNewCandidateCommand = (inputString) => {
		errorMessage = 'UNKNOWN_SUGGESTING';
		var suggestions = suggestionsAfterChainedCommands(inputString);
		if (suggestions === null) {
			//view.setErrorMsg('Does not match any commands');
			view.setErrorMsg(errorMessage);
		} else if (inputString === '') {
			view.setSuggestedCommands([]); //show nothing
		} else if (inputString !== '' && inputString.trim() === '') {
			view.setInfoMsg('TO_SHOW_COMMANDS');
			//view.setSuggestedCommands([]);//show nothing
		} else {
			var filterByCommand = (command) => {
				return (suggestions.indexOf(command.command) !== -1);
			};
			var filteredList = availableCommands.filter(filterByCommand)
				.map(includeId);
			view.setSuggestedCommands(filteredList);
		}
	};

	this.onSelectingHighlightedCommand = (highlightedCommand, originalText) => {
		var commands = parseCommands(originalText);

		var lastCommand;
		if (commands === null) {
			lastCommand = originalText;
		} else {
			lastCommand = commands[commands.length - 1];
		}
		var tidyLastCommand = lastCommand.trimLeft()
			.toLowerCase();

		var suggestion;
		if (isCommandAcceptArg(highlightedCommand)) {
			suggestion = highlightedCommand + ' ';
		} else {
			suggestion = highlightedCommand;
		}
		if (!tidyLastCommand.startsWith(suggestion) && !suggestion.startsWith(tidyLastCommand)) {
			var newText = originalText + suggestion;
			view.setText(newText);
			this.onInvalidateActiveCommand();
			this.onNewCandidateCommand(newText);
		}
		if (!tidyLastCommand.startsWith(suggestion) && suggestion.startsWith(tidyLastCommand)) {
			var suggestionStart = originalText.length - tidyLastCommand.length;
			var newText = originalText.substring(0, suggestionStart) + suggestion;
			view.setText(newText);
			this.onInvalidateActiveCommand();
			this.onNewCandidateCommand(newText);
		}
	};

	this.onInvalidateActiveCommand = () => {
		FilterActions.deleteFilters();
	};

	this.componentDidMount = () => {
		FilterStore.addChangeListener(this._handleFilterChange);
	};

	this.componentWillUnmount = () => {
		FilterStore.removeChangeListener(this._handleFilterChange);
	};

	this._handleFilterChange = (filter) => {
		var filters = FilterStore.getFilters();
		view.setActiveColor(filters !== null);
	};
};

export default CommandBarPresenter;
export {
	availableCommands,
	validateTime,
	SuggestionsAfterFullCommand,
	SuggestionsAfterPartialCommand,
	suggestionsAfterChainedCommands
};
