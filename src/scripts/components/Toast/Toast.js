/**
 * Toast Component
 * @author Alexander Luksidadi
 */

import React from 'react';
import render from './render.jsx';

import Toaster from '../../stores/Toaster';
import ToastActions from '../../actions/ToastActions';
/**
 * Toast Component
 */
var Toast = React.createClass({

	/** Property Types */
	propTypes: {
		animate: React.PropTypes.bool
	},

	/** Get initial state */
	getInitialState: function () {
		return {
			messages: Toaster.getMessages()
		};
	},

	getDefaultProps: function () {
		return {
			animate: false
		};
	},

	/** Messages handler */
	handleMessages: function () {
		this.setState({
			messages: Toaster.getMessages()
		});
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		Toaster.addChangeListener(this.handleMessages);
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		Toaster.removeChangeListener(this.handleMessages);
	},

	/** Click handler */
	handleClick: function (message) {
		if (message.type !== 'application-error') {
			ToastActions.remove(message.id);
		}

		if (typeof message.clickCommand === 'function') {
			message.clickCommand();
		}
	},

	_makeMessages: function () {
		var messages = [];
		for (var i = 0; i < this.state.messages.length; i++) {
			var type = this.state.messages[i].type;
			var text = this.state.messages[i].text;
			var fat = this.state.messages[i].fat;
			var id = this.state.messages[i].id;
			var clickCommand = this.state.messages[i].clickHandler;

			var m = render.Message({
				id: id,
				key: id,
				type: type,
				fat: fat,
				text: text,
				clickCommand: clickCommand,
				handleClick: this.handleClick
			});
			messages.push(m);
		}
		return messages;
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Toast.call(this);
	}
});

export default Toast;
