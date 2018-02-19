/**
 * MapView Component
 */

import React from 'react';
import render from './render.jsx';

import SiteStore from '../../../../../../stores/SiteStore';

/**
 * MapView Component
 */
var MapView = React.createClass({

	/** Get initial states */
	getInitialState: function () {
		return {
			isGoogleMapLoaded: (typeof window.google === 'object' && typeof window.google.maps === 'object'),
			sites: SiteStore.get()
		};
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		SiteStore.addChangeListener(this._handleSitessChange);
		if (!this.state.isGoogleMapLoaded) {
			setTimeout(this._handleCheckGoogleMap, 500);
		}
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		SiteStore.removeChangeListener(this._handleSitessChange);
	},

	/** Ensure google map is loaded */
	_handleCheckGoogleMap: function () {
		if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
			this.setState({
				isGoogleMapLoaded: true
			});
		} else {
			setTimeout(this._handleCheckGoogleMap, 500);
		}
	},

	/** When sites changed, update state */
	_handleSitessChange: function () {
		this.setState({
			sites: SiteStore.get()
		});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.MapView.call(this);
	}
});

export default MapView;
