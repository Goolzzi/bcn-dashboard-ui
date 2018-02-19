/**
 * Header Component
 * @author Alexander Luksidadi
 */

import React from 'react';
import render from './render.jsx';

/**
 * Header Component
 */
var Header = React.createClass({

	/** Property Types */
	propTypes: {
		userInfo: React.PropTypes.object.isRequired,
		customerName: React.PropTypes.string.isRequired
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Header.call(this);
	}
});

export default Header;
