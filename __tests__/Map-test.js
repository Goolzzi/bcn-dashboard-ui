jest.dontMock('../src/scripts/components/Map/Map');
jest.dontMock('../src/scripts/components/Map/mapOptions');
jest.dontMock('../src/scripts/components/Map/render.jsx');
jest.dontMock('lodash');

describe('Map component tests', function () {
	let Map = require('../src/scripts/components/Map')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let mapOptions = require('../src/scripts/components/Map/mapOptions')
		.default;
	let googleUtils = require('../__testutils__/googleutils');

	var sites = [];

	window.google = googleUtils.mockGoogle;

	var sut;
	var nodeZoomIn, nodeZoomOut, nodeMap;

	beforeEach(function () {
		sut = ReactTestUtils.renderIntoDocument(React.createElement(Map, {
			sites: sites
		}));
		nodeMap = ReactDOM.findDOMNode(sut);
		nodeZoomIn = nodeMap.querySelector('*[class="zoom-in"]');
		nodeZoomOut = nodeMap.querySelector('*[class="zoom-out"]');
	});

	it('should be mounted correctly', function () {
		expect(nodeMap.querySelector('*[data-bcn-id="googleMap"]'))
			.not.toBeNull();
		expect(sut.state.map)
			.not.toBeNull();
	});

	it('should set the zoom level to world by default', function () {
		expect(sut.state.map.setZoom)
			.toBeCalledWith(mapOptions.worldLevel.minZoom);
	});

	it('should set listeners for requried events', function () {
		expect(sut.state.map.addListener)
			.toBeCalledWith('zoom_changed', sut._handleZoomChanged);
		expect(sut.state.map.addListener)
			.toBeCalledWith('bounds_changed', sut._handleBoundsChanged);
	});

	it('should set listeners for requried events', function () {
		expect(sut.state.map.addListener)
			.toBeCalledWith('zoom_changed', sut._handleZoomChanged);
		expect(sut.state.map.addListener)
			.toBeCalledWith('bounds_changed', sut._handleBoundsChanged);
	});

	it('should update the bounds state when handling bounds changed updates', function () {
		sut.setState = jest.fn(sut.setState);
		sut.state.map.getBounds = jest.fn(() => {
			return 'newbounds'
		});
		sut.state.map.getCenter = jest.fn(() => {
			return 'newcenter'
		});
		sut._handleBoundsChanged();
		expect(sut.setState)
			.toBeCalledWith({
				bounds: 'newbounds',
				center: 'newcenter'
			});
	});

	it('should set initial postion to long:0 lat:0 and place markers', function () {

		sut._handleRemoveAllMarkers = jest.fn(() => {});
		sut._handlePlaceMarkers = jest.fn(() => {});

		sut.state.map.setCenter = jest.fn();
		sut.state.map.getZoom = jest.fn(() => {
			return 2
		});

		sut._handleZoomChanged(true);

		expect(sut.state.map.setCenter)
			.toBeCalled();
		expect(sut.state.map.setCenter.mock.calls[0][0].latitude)
			.toEqual(0);
		expect(sut.state.map.setCenter.mock.calls[0][0].longitude)
			.toEqual(0);

		expect(sut._handleRemoveAllMarkers)
			.toBeCalled();
		expect(sut._handlePlaceMarkers)
			.toBeCalled();

	});


	it('should set the postion to long:0 lat:0 when zoom level changes to 2', function () {

		sut.state.map.getZoom = jest.fn(() => {
			return 3
		});

		sut._handleZoomChanged();

		sut.state.map.getZoom = jest.fn(() => {
			return 2
		});
		sut.state.map.setCenter = jest.fn();

		sut._handleZoomChanged();

		expect(sut.state.map.setCenter)
			.toBeCalled();
		expect(sut.state.map.setCenter.mock.calls[0][0].latitude)
			.toEqual(0);
		expect(sut.state.map.setCenter.mock.calls[0][0].longitude)
			.toEqual(0);
	});

	it('should change to worldLevel view if not currently at world view and zoom level between 2 and 4', function () {
		for (var z = 2; z <= 4; z++) {
			sut.state.zoom = 6;
			sut.state.map.getZoom = jest.fn(() => {
				return z
			});
			sut.state.map.getMapTypeId = jest.fn(() => {
				return mapOptions.countryLevel.mapTypeId
			});

			sut.state.map.setOptions = jest.fn();
			sut._handleZoomChanged();
			expect(sut.state.map.setOptions)
				.toBeCalledWith(mapOptions.worldLevel);
		}
	});

	it('should change to countryLevel view if not currently at world view and zoom level between 5 and 7', function () {
		for (var z = 5; z <= 7; z++) {
			sut.state.zoom = 3;
			sut.state.map.getZoom = jest.fn(() => {
				return z
			});
			sut.state.map.getMapTypeId = jest.fn(() => {
				return mapOptions.worldLevel.mapTypeId
			});

			sut.state.map.setOptions = jest.fn();
			sut._handleZoomChanged();
			expect(sut.state.map.setOptions)
				.toBeCalledWith(mapOptions.countryLevel);
		}
	});

	it('should change to cityLevel view if not currently at world view and zoom level between 5 and 7', function () {
		for (var z = 8; z <= 15; z++) {
			sut.state.zoom = 7;
			sut.state.map.getZoom = jest.fn(() => {
				return z
			});
			sut.state.map.getMapTypeId = jest.fn(() => {
				return mapOptions.countryLevel.mapTypeId
			});

			sut.state.map.setOptions = jest.fn();
			sut._handleZoomChanged();
			expect(sut.state.map.setOptions)
				.toBeCalledWith(mapOptions.cityLevel);
		}
	});

	it('should increase the zoom level when _handleZoomIn callback called', function () {
		sut.state.zoom = 2;
		sut.state.map.setZoom = jest.fn();
		sut._handleZoomIn();
		expect(sut.state.map.setZoom)
			.toBeCalledWith(3);
	});

	it('should decrease the zoom level when _handleZoomOut callback called', function () {
		sut.state.zoom = 3;
		sut.state.map.setZoom = jest.fn();
		sut._handleZoomOut();
		expect(sut.state.map.setZoom)
			.toBeCalledWith(2);
	});

	it('should disable the zoom in button when zoom level hits 15', function () {
		sut.state.map.getZoom = jest.fn(() => {
			return 14
		});
		sut._handleZoomChanged();
		expect(nodeZoomIn.disabled)
			.toEqual(false);
		sut.state.map.getZoom = jest.fn(() => {
			return 15
		});
		sut._handleZoomChanged();
		expect(nodeZoomIn.disabled)
			.toEqual(true);
	});

	it('should disable the zoom out button when zoom level hits 2', function () {
		sut.state.map.getZoom = jest.fn(() => {
			return 3
		});
		sut._handleZoomChanged();
		expect(nodeZoomOut.disabled)
			.toEqual(false);
		sut.state.map.getZoom = jest.fn(() => {
			return 2
		});
		sut._handleZoomChanged();
		expect(nodeZoomOut.disabled)
			.toEqual(true);
	});

	it('should call ZoomIn when zoom in button clicked', function () {
		var currentZoom = sut.state.zoom;
		sut.state.map.setZoom = jest.fn();
		ReactTestUtils.Simulate.click(nodeZoomIn);
		expect(sut.state.map.setZoom)
			.toBeCalledWith(currentZoom + 1);
	});

	it('should call ZoomOut when zoom out button clicked', function () {
		sut.state.map.getZoom = jest.fn(() => {
			return 3
		});
		sut._handleZoomChanged();

		var currentZoom = sut.state.zoom;
		sut.state.map.setZoom = jest.fn();
		ReactTestUtils.Simulate.click(nodeZoomOut);
		expect(sut.state.map.setZoom)
			.toBeCalledWith(currentZoom - 1);
	});

	it('should remove all the markers from state when _handleRemoveAllMarkers() called', function () {
		// Place some fake markers
		sut.state.markers = [
			{
				position: 'pos1',
				optimised: false,
				icon: null,
				map: null,
				setMap: () => {}
			},
			{
				position: 'pos2',
				optimised: false,
				icon: null,
				map: null,
				setMap: () => {}
			}
                    ];
		sut._handleRemoveAllMarkers();
		expect(sut.state.markers.length)
			.toEqual(0);
	});

	it('should place markers on the map using array of Node objects', function () {
		// Make some Nodes that represent sites on the map
		var props = {
			sites: [
				{
					location: {
						lat: 43.773677,
						lng: -79.383802
					}
				},
				{
					location: {
						lat: 43.653226,
						lng: -79.283184
					}
				},
				{
					location: {
						lat: 49.282729,
						lng: -123.120738
					}
				}
                        ]
		};
		props.sites.forEach(function (site) {
			site.siteId = "ssss";
			site.siteName = "blah";
		});

		sut.componentWillReceiveProps(props);
		expect(sut.state.markers.length)
			.toEqual(props.sites.length);

		// Change zoom
		sut.state.markers = []; // Clear existing markers
		sut.state.zoom = 5;
		sut.state.map.getZoom = jest.fn(() => {
			return 8
		});
		sut.state.map.getMapTypeId = jest.fn(() => {
			return mapOptions.countryLevel.mapTypeId
		});
		sut.state.map.setOptions = jest.fn();

		sut._handleZoomChanged();
		expect(sut.state.markers.length)
			.toEqual(props.sites.length);

		// Change zoom again
		sut.state.markers = []; // Clear existing markers
		sut.state.zoom = 8;
		sut.state.map.getZoom = jest.fn(() => {
			return 6
		});
		sut.state.map.getMapTypeId = jest.fn(() => {
			return mapOptions.cityLevel.mapTypeId
		});
		sut.state.map.setOptions = jest.fn();

		sut._handleZoomChanged();
		expect(sut.state.markers.length)
			.toEqual(props.sites.length);

	});
});
