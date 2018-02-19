import render from './render.jsx';
import React from 'react';
import classnames from 'classnames';
const Spinner = require('../Spinner')
	.default;

/**
 * ResetPassword Component
 */
var TextFieldGroup = React.createClass({

	/** Property Types */
	propTypes: {
		field: React.PropTypes.string.isRequired,
		value: React.PropTypes.string.isRequired,
		label: React.PropTypes.string.isRequired,
		error: React.PropTypes.string,
		type: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired,
		onBlur: React.PropTypes.func,
		disabled: React.PropTypes.bool,
		hasSpinner: React.PropTypes.bool,
		isInProcess: React.PropTypes.bool,
		bcnID: React.PropTypes.string
	},

	defaultProps: {
		type: 'text',
		hasSpinner: false
	},

	/** Get initial state */
	getInitialState: function () {

		return {};
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {

		return render.TextFieldGroup.call(this);
	}
});

export default TextFieldGroup;
