import render from './render.jsx';
import React from 'react';

/**
 * Spinner Component
 */
var Spinner = React.createClass({

	/** Property Types */
	propTypes: {
		classNames: React.PropTypes.string,
		divClassNames: React.PropTypes.string,
		show: React.PropTypes.bool.isRequired,
		center: React.PropTypes.bool,
		display: React.PropTypes.string
	},

	/** Get initial state */
	getInitialState: function () {
		return {};
	},

	/** Fires before component is mounted */
	componentWillMount: function () {},

	/** Fires after component is mounted */
	componentDidMount: function () {},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Spinner.call(this);
	}
});

export default Spinner;
