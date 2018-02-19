var _geocoder = {
	geocode: jest.fn()
};

module.exports = {
	mockGoogle: {
		maps: {
			Geocoder: function () {
				return _geocoder;
			},
			GeocoderStatus: {
				OK: 'OK',
				ZERO_RESULTS: 'ZERO_RESULTS',
				OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
				REQUEST_DENIED: 'REQUEST_DENIED',
				INVALID_REQUEST: 'INVALID_REQUEST'
			},
			InfoWindow: function () {
				return {};
			},
			LatLng: function (lat, lng) {
				return {
					latitude: parseFloat(lat),
					longitude: parseFloat(lng),
					lat: function () {
						return this.latitude;
					},
					lng: function () {
						return this.longitude;
					}
				};
			},
			LatLngBounds: function (ne, sw) {
				return {
					getSouthWest: function () {
						return sw;
					},
					getNorthEast: function () {
						return ne;
					},
					extend: function () {}
				};
			},
			OverlayView: function () {
				return {};
			},
			Marker: function () {
				var events = {};
				return {
					addListener: function (eventName, callback) {
						events[eventName] = callback;
					},
					setIcon: function () {},
					setMap: function () {}
				}
			},
			MarkerImage: function () {
				return {};
			},
			Map: function () {
				var options = {};
				var events = {};
				var zoom = 1;
				return {
					addListener: jest.fn(function (eventName, callback) {
						events[eventName] = callback;
					}),
					setZoom: jest.fn(function (z) {
						zoom = z;
						events['zoom_changed']();
					}),
					getZoom: function () {
						return zoom;
					},
					setCenter: function () {},
					getCenter: function () {},
					getBounds: function () {},
					getMapTypeId: function () {
						return options.mapTypeId;
					},
					setOptions: function (opts) {
						options = opts;
					},
					getOptions: function (opts) {
						return options;
					},
					mapTypes: {
						set: function () {}
					}
				};
			},
			Point: function () {
				return {};
			},
			Size: function () {
				return {};
			},
			StyledMapType: function (style, props) {}
		}
	}
}
