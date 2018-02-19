import render from './render.jsx';
import React from 'react';

import FilterStore from '../../stores/FilterStore';

/**
 * Command Bar Component
 */
// @TODO: Handle available commands selection when there is a scroll (probably will
// need to properly select the elements instead of just adding a `highlighted` css class)
const CommandBar = React.createClass({

	/** Property Types */
	propTypes: {
		router: React.PropTypes.object,
		presenter: React.PropTypes.func
	},

	/** Get initial state */
	getInitialState() {
		return {
			enteredCommand: '',
			showAvailableCommands: false, // also set to true if we want to show an error
			commandError: '',
			commandInfo: '',
			highlightedCommand: null,
			isActive: false,
			presenter: new this.props.presenter(this, this.props.router)
		};
	},

	/** Fires after component is mounted */
	componentDidMount() {
		// Restore command bar content
		var commandText = FilterStore.getCommandText();
		if (commandText !== null) {
			this.setText(commandText);
			// Assuming that saved command is correct
			this.setActiveColor(true);
		}

		this.state.presenter.componentDidMount();
	},

	componentWillUnmount() {
		this.state.presenter.componentWillUnmount();
	},

	_findPrevAvailableCommand(commandGroups, currentCommandId) {
		var foundCurrent = false;
		var prevCommand = null;
		commandGroups.some(group => {
			group.commands.some(command => {
				if (command.id === currentCommandId) {
					foundCurrent = true;
					return true;
				}
				prevCommand = command.id;
			});
			return foundCurrent;
		});
		return prevCommand;
	},

	_findNextAvailableCommand(commandGroups, currentCommandId) {
		var foundCurrent = false;
		var nextCommand = null;
		commandGroups.some(group => {
			group.commands.some(command => {
				if (foundCurrent || currentCommandId === null) {
					// Means that previous command was current or no current command
					nextCommand = command.id;
					return true;
				}
				if (command.id === currentCommandId) {
					foundCurrent = true;
				}
			});
			return !!nextCommand;
		});
		return nextCommand;
	},

	_handleKeyDown(e) {
		if (e.keyCode === 13) { // Enter
			if (this.state.highlightedCommand) {
				this.state.presenter.onSelectingHighlightedCommand(this.state.highlightedCommand, this.state.enteredCommand);
				this.setState({
					highlightedCommand: null
				});
			} else {
				this.state.presenter.onInvalidateActiveCommand();
				this.state.presenter.onExecuteCommand(e.target.value);
			}
		}

		if (e.keyCode === 38) { // Up Arrow
			e.preventDefault();

			if (this.state.showAvailableCommands) {
				var prevCommand = this._findPrevAvailableCommand(
					this.state.commandGroupsFiltered, this.state.highlightedCommand);

				this.setState({
					highlightedCommand: prevCommand
				});
			}

			this.state.presenter.onNewCandidateCommand(this.state.enteredCommand);
		}

		if (e.keyCode === 40) { // Down Arrow
			e.preventDefault();

			if (this.state.showAvailableCommands) {
				var nextCommand = this._findNextAvailableCommand(
					this.state.commandGroupsFiltered, this.state.highlightedCommand);

				this.setState({
					highlightedCommand: nextCommand
				});
			}

			this.state.presenter.onNewCandidateCommand(this.state.enteredCommand);
		}

		if (e.keyCode === 27) { // Escape
			e.preventDefault(); // otherwise Firefox doesn't clear text box, for some reason
			this._userSetText('');
		}
	},

	_userSetText(text) {
		// This ensures that what we just entered will get propagated back to the view
		this.setState({
			enteredCommand: text,
			highlightedCommand: null
		});
		this.state.presenter.onInvalidateActiveCommand();
		this.state.presenter.onNewCandidateCommand(text, true);
	},

	_handleChange(e) {
		this._userSetText(e.target.value);
	},

	_handleFocus(e) {
		/* currently nothing to do */
	},

	_handleCommandClick(command) {
		this.refs.commandBarInput.focus();
		this.state.presenter.onSelectingHighlightedCommand(command.id, this.state.enteredCommand);
		this.setState({
			highlightedCommand: null
		});
	},

	_handleMouseOver(command) {
		this.setState({
			highlightedCommand: command.id
		});
	},

	_handleMouseOut(command) {
		this.setState({
			highlightedCommand: null
		});
	},

	createCommandGroups(commands) {
		var groups = [];
		commands.forEach(command => {
			var commandGroup = groups.find(group => group.group_name === command.group_name);
			if (commandGroup === undefined) {
				commandGroup = Object.assign({}, commandGroup);
				commandGroup.group_name = command.group_name;
				commandGroup.commands = [];
				groups.push(commandGroup);
			}
			commandGroup.commands.push(command);
		});
		return groups;
	},

	/**
	 * If passed a nonempty list, show dropdown list of suggested commands
	 * Format:
	 *   [ {command: 'foo', description: 'bar'}, ... ]
	 * If passed an empty list, hide dropdown list
	 * Also hide dropdown error message.
	 */
	setSuggestedCommands(commands) {
		if (!(commands instanceof Array)) {
			throw new Error('NOT_ARRAY');
		}

		var show = (commands.length !== 0);
		var groups = this.createCommandGroups(commands);
		this.setState({
			commandGroupsFiltered: groups,
			showAvailableCommands: show,
			commandError: '',
			commandInfo: ''
		});
	},

	setErrorMsg(errorCode) {
		if (typeof errorCode !== 'string' || errorCode === '') {
			throw new Error('NONEMPTY_STRING');
		}
		var errorList = this.state.presenter.errorList;
		var errorMsg;
		if (errorCode in errorList) {
			errorMsg = errorList[errorCode];
		} else {
			errorMsg = 'An unexpected error occurred: ' + errorCode;
		}

		this.setState({
			commandGroupsFiltered: [],
			showAvailableCommands: true,
			commandError: errorMsg,
			commandInfo: ''
		});
	},

	setInfoMsg(infoCode) {
		if (typeof infoCode !== 'string' || infoCode === '') {
			throw new Error('NONEMPTY_STRING');
		}
		var informationList = this.state.presenter.informationList;
		var infoMsg;
		if (infoCode in informationList) {
			infoMsg = informationList[infoCode];
		} else {
			errorMsg = 'An unexpected info occurred: ' + errorCode;
		}

		this.setState({
			commandGroupsFiltered: [],
			showAvailableCommands: true,
			commandError: '',
			commandInfo: infoMsg
		});
	},

	setText(text) {
		this.setState({
			enteredCommand: text
		});
	},

	setActiveColor(active) {
		this.setState({
			isActive: active
		});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render() {
		return render.CommandBar.call(this);
	}
});

export default CommandBar;
