import render from './render.jsx';
import React from 'react';

/**
 * Clock Component
 */
var Clock = React.createClass({

	timeoutId: 0,

	/** Property Types */
	propTypes: {
		live: React.PropTypes.bool.isRequired
	},

	/** Get initial state */
	getInitialState: function () {
		return {};
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		if (this.props.live) {
			this.tick(true);
		}
	},

	/** Fires after re-render */
	componentDidUpdate: function (prevProps) {
		if (this.props.live !== prevProps.live) {
			if (!this.props.live && this.timeoutId) {
				clearTimeout(this.timeoutId);
				this.timeoutId = undefined;
			}
			this.tick();
		}
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
	},

	tick: function (refresh) {
		if (!this.isMounted() || !this.props.live) {
			return;
		}

		var period = 1000;

		this.timeoutId = setTimeout(this.tick, period);

		if (!refresh) {
			this.forceUpdate()
		}
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Clock.call(this);
	}

});

export default Clock;
