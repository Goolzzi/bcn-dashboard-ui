/**
 * Tabs Component
 */
import React from 'react';
import render from './render.jsx';

import _ from 'lodash';

/**
 * Tabs Component
 */
var Tabs = React.createClass({

	/** Property Types */
	propTypes: {
		active: React.PropTypes.string.isRequired,
		items: React.PropTypes.arrayOf(React.PropTypes.shape({
				id: React.PropTypes.string.isRequired,
				title: React.PropTypes.string.isRequired,
				getContentCallback: React.PropTypes.func
			}))
			.isRequired
	},

	/** Get initial state */
	getInitialState: function () {
		return {
			itemsById: _.keyBy(this.props.items, 'id')
		};
	},

	/** Make tabs components */
	_makeTabs: function () {
		var active = this.props.active;
		return _.map(this.props.items, function (item) {
			return render.Tab({
				key: item.id,
				item: item,
				isActive: item.id === active
			});
		});
	},

	/** Make content that's tab is active */
	_makeContent: function () {
		if (this.state.itemsById.hasOwnProperty(this.props.active)) {
			return this.state.itemsById[this.props.active].getContentCallback();
		}
		return null;
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Tabs.call(this);
	}
});

export default Tabs;
