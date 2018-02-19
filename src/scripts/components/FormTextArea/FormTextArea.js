/**
 * FormTextArea Component
 */

import render from './render.jsx';
import React from 'react'; // eslint-disable-line no-unused-vars
var {
	PropTypes
} = React; // eslint-disable-line no-unused-vars

/**
 * FormTextArea Component
 */
var FormTextArea = React.createClass({

	/** Property Types */
	propTypes: {
		handleInputValueChange: PropTypes.func.isRequired,
		inputValidationMessage: PropTypes.string,
		value: PropTypes.string.isRequired,
		inputLabelText: PropTypes.string.isRequired,
		placeHolderText: PropTypes.string.isRequired,
		resize: PropTypes.bool.isRequired,
		maxLength: PropTypes.number.isRequired
	},


	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.FormTextArea.call(this);
	}

});

export default FormTextArea;
