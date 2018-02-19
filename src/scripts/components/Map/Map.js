import render from './render.jsx';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import IdleActions from '../../actions/IdleActions';
import ConfigurationStore from '../../stores/ConfigurationStore';
import mapWorldStyle from './mapWorldStyle';
import mapCountryStyle from './mapCountryStyle';
import mapCityStyle from './mapCityStyle';
import mapOptions from './mapOptions';
import LogManager from '../../logger/logger';

const LOGGER = LogManager.getLogger('Map');


var getMarkerIcon = function (node, alert, zoom) {
	var id = node.id;
	var shape = 'circle';
	var color = 'grey';
	var size = 'small';
	var width = 31;
	var height = 31;

	var multiplier = '';
	if (zoom >= 5 && zoom <= 7) {
		multiplier = '-1.5x';
		width = 45;
		height = 45;
	} else if (zoom >= 8) {
		multiplier = '-2x';
		width = 60;
		height = 60;
	}
	var url = 'images/' + shape + '-' +
		color + '-' +
		size +
		multiplier +
		'.png' +
		(id ? '?id=' + id : '');

	return {
		url: url,
		size: new google.maps.Size(width, height),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(Math.floor(width / 2), Math.floor(height / 2))
	};
};

class Node {
	constructor(loc) {
		this.id = _.uniqueId();
		this.name = loc.siteName;
		this.lat = loc.location.lat;
		this.lon = loc.location.lng;
	}

	getLat() {
		return this.lat;
	}

	getLon() {
		return this.lon;
	}

	getName() {
		return this.name;
	}
}

/**
 * Map Component
 */
var Map = React.createClass({
	/** Property Types */
	propTypes: {
		sites: React.PropTypes.array.isRequired
	},

	/** Get initial state */
	getInitialState: function () {
		return {
			map: null,
			zoom: null,
			bounds: null,
			center: null,
			individualNodes: this._constructNodes(this.props),
			markers: []
		};
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		var mapDOM = ReactDOM.findDOMNode(this)
			.querySelector('#google-map');
		// setState does not work here
		this.state.map = new window.google.maps.Map(mapDOM, mapOptions.worldLevel);

		this.state.map.mapTypes.set('WorldView', new window.google.maps.StyledMapType(mapWorldStyle, {
			name: 'World View'
		}));
		this.state.map.mapTypes.set('CountryView', new window.google.maps.StyledMapType(mapCountryStyle, {
			name: 'Country View'
		}));
		this.state.map.mapTypes.set('CityView', new window.google.maps.StyledMapType(mapCityStyle, {
			name: 'City View'
		}));
		this.state.map.addListener('zoom_changed', this._handleZoomChanged);
		this.state.map.addListener('bounds_changed', this._handleBoundsChanged);
		this.state.map.setZoom(mapOptions.worldLevel.minZoom);
		this._handleZoomChanged(true);
		this.forceUpdate();
	},

	_constructNodes: function (props) {
		return _.map(props.sites, function (l) {
			return new Node(l);
		});
	},

	/** Invoked when a component is receiving new props. */
	componentWillReceiveProps: function (nextProps) {
		if (_.isEqual(this.props.sites, nextProps.sites)) {
			return;
		}

		this.state.individualNodes = this._constructNodes(nextProps);
		this._handleZoomChanged(true);
	},

	/** Mouse drage handler */
	_handleBoundsChanged: function () {
		this.setState({
			bounds: this.state.map.getBounds()
				.toString(),
			center: this.state.map.getCenter()
				.toString()
		});
	},


	/** Zoom changed handler */
	_handleZoomChanged: function (force) {
		var previousZoom = this.state.zoom;

		var currentZoom = this.state.map.getZoom();
		if (force || previousZoom !== currentZoom) {
			// set the new value
			// setState does not work here
			this.state.zoom = currentZoom;

			if (this.state.zoom === 2) {
				if (force) {
					this._handleRemoveAllMarkers();
					this._handlePlaceMarkers(this.state.individualNodes);
				}
				this.state.map.setCenter(new window.google.maps.LatLng(0, 0));
			}
			if (this.state.zoom >= mapOptions.worldLevel._minZoom && this.state.zoom <= mapOptions.worldLevel._maxZoom && this.state.map.getMapTypeId() !== mapOptions.worldLevel.mapTypeId) {
				LOGGER.logDebug('Changing map style to world');
				this._handleWorldView();
			} else if (this.state.zoom >= mapOptions.countryLevel._minZoom && this.state.zoom <= mapOptions.countryLevel._maxZoom && this.state.map.getMapTypeId() !== mapOptions.countryLevel.mapTypeId) {
				LOGGER.logDebug('Changing map style to country');
				this._handleCountryView();
			} else if (this.state.zoom >= mapOptions.cityLevel._minZoom && this.state.zoom <= mapOptions.cityLevel._maxZoom && this.state.map.getMapTypeId() !== mapOptions.cityLevel.mapTypeId) {
				LOGGER.logDebug('Changing map style to city');
				this._handleCityView();
			}
			this.forceUpdate();
		}

		IdleActions.resetTimer(ConfigurationStore.getIdleTimeoutSeconds());
	},

	/** Change view to world */
	_handleWorldView: function () {
		this._handleRemoveAllMarkers();
		this.state.map.setOptions(mapOptions.worldLevel);
		this._handlePlaceMarkers(this.state.individualNodes);
	},

	/** Change view to country */
	_handleCountryView: function () {
		this._handleRemoveAllMarkers();
		this.state.map.setOptions(mapOptions.countryLevel);
		this._handlePlaceMarkers(this.state.individualNodes);
	},

	/** Change view to city */
	_handleCityView: function () {
		this._handleRemoveAllMarkers();
		this.state.map.setOptions(mapOptions.cityLevel);
		this._handlePlaceMarkers(this.state.individualNodes);
	},

	/** Clears all markers */
	_handleRemoveAllMarkers: function () {
		while (this.state.markers.length) {
			this.state.markers.pop()
				.setMap(null);
		}
	},

	_handlePlaceMarkers: function (nodes) {
		//create empty LatLngBounds object

		var bounds = new window.google.maps.LatLngBounds();

		for (var y = 0, maxsites = nodes.length; y < maxsites; y++) {
			var marker = new window.google.maps.Marker({
				position: new window.google.maps.LatLng(nodes[y].getLat(), nodes[y].getLon()),
				optimized: false,
				icon: getMarkerIcon(nodes[y], null, this.state.zoom),
				map: this.state.map
			});

			//extend the bounds to include each marker's position
			bounds.extend(marker.position);

			marker._node = nodes[y];

			this.state.markers.push(marker);
		}
	},

	/** Zoom in */
	_handleZoomIn: function () {
		this.state.map.setZoom(this.state.zoom + 1);
	},

	/** Zoom out */
	_handleZoomOut: function () {
		this.state.map.setZoom(this.state.zoom - 1);
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Map.call(this);
	}

});

export default Map;
