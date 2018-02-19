/**
 * Map Component
 * @author Alexander Luksidadi
 */

// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
var mapOptions = {
	worldLevel: {
		backgroundColor: '#192A42',
		// How zoomed in you want the map to start at (always required)
		minZoom: 2,
		maxZoom: 15,
		_minZoom: 2,
		_maxZoom: 4,
		//zoom: 2,
		mapTypeId: 'WorldView',
		mapTypeControlOptions: {
			mapTypeIds: ['WorldView', 'CountryView', 'CityView']
		},

		disableDefaultUI: true,
		draggable: true,
		zoomControl: false,
		scrollwheel: true,
		keyboardShortcuts: true,
		disableDoubleClickZoom: false
	},
	countryLevel: {
		backgroundColor: '#192a42',
		minZoom: 2,
		maxZoom: 15,
		_minZoom: 5,
		_maxZoom: 7,
		//zoom: 5,
		mapTypeId: 'CountryView',
		mapTypeControlOptions: {
			mapTypeIds: ['WorldView', 'CountryView', 'CityView']
		},
		disableDefaultUI: true,
		draggable: true,
		zoomControl: false,
		scrollwheel: true,
		keyboardShortcuts: true,
		disableDoubleClickZoom: false
	},
	cityLevel: {
		backgroundColor: '#192a42',
		minZoom: 2,
		maxZoom: 15,
		_minZoom: 8,
		_maxZoom: 15,
		//zoom: 8,
		mapTypeId: 'CityView',
		mapTypeControlOptions: {
			mapTypeIds: ['WorldView', 'CountryView', 'CityView']
		},
		disableDefaultUI: true,
		draggable: true,
		zoomControl: false,
		scrollwheel: true,
		keyboardShortcuts: true,
		disableDoubleClickZoom: false
	}
};

export default mapOptions;
