/**
 * FormTextInput Component
 */

import render from './render.jsx';
import React from 'react'; // eslint-disable-line no-unused-vars
var {
	PropTypes
} = React; // eslint-disable-line no-unused-vars

/**
 * FormTextInput Component
 */
var FormTextInput = React.createClass({

	/** Property Types */
	propTypes: {
		handleInputValueChange: PropTypes.func.isRequired,
		inputValidationMessage: PropTypes.string,
		value: PropTypes.string.isRequired,
		inputLabelText: PropTypes.string.isRequired,
		placeHolderText: PropTypes.string.isRequired,
		maxLength: PropTypes.number.isRequired
	},


	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.FormTextInput.call(this);
	}

});

export default FormTextInput;
