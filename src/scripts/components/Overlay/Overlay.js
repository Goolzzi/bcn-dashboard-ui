import render from './render.jsx';
import React from 'react';
import LogManager from '../../logger/logger'

const LOGGER = LogManager.getLogger('Overlay');

/**
 * Overlay Component
 */
var Overlay = React.createClass({

	/** Property Types */
	propTypes: {
		zIndexClass: React.PropTypes.string.isRequired,
		closeHandler: React.PropTypes.func.isRequired,
		isEditing: React.PropTypes.bool,
		deleteHandler: React.PropTypes.func,
		saveHandler: React.PropTypes.func,
		opacity: React.PropTypes.number,
		isShown: React.PropTypes.bool,
		isLoading: React.PropTypes.bool,
		hasUnsavedChanges: React.PropTypes.bool,
		className: React.PropTypes.string,
		breadcrumb: React.PropTypes.arrayOf(React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			clickCallback: React.PropTypes.func
		}))
	},

	/** Get initial state */
	getInitialState: function () {
		LOGGER.logDebug('getInitialState - called');

		return {
			// isLoading: false,
			// isEditing: false
		};
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		this.state.isLoading = (typeof (this.props.isLoading) == 'undefined' ? false : this.props.isLoading);
		return render.Overlay.call(this);
	}

});

export default Overlay;
