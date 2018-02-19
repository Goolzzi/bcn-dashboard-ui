/**
 * Map - World Style
 * @author Alexander Luksidadi
 */

// World style
const style = [
	{
		'featureType': 'all',
		'elementType': 'labels.text.fill',
		'stylers': [
			{
				'color': '#ffffff'
            }
        ]
    },
	{
		'featureType': 'all',
		'elementType': 'labels.text.stroke',
		'stylers': [
			{
				'color': '#000000'
            },
			{
				'lightness': 13
            }
        ]
    },
	{
		'featureType': 'administrative',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'on'
            }
        ]
    },
	{
		'featureType': 'administrative',
		'elementType': 'labels.test.fill',
		'stylers': [
			{
				'color': '#053e5f'
            }
        ]
    },
	{
		'featureType': 'administrative',
		'elementType': 'geometry',
		'stylers': [
			{
				'visibility': 'on'
            }
        ]
    },
	{
		'featureType': 'administrative',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'color': '#000000'
            },
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'administrative',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'color': '#144b53'
            },
			{
				'lightness': 14
            },
			{
				'weight': 1.4
            }
        ]
    },
	{
		'featureType': 'administrative.country',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'color': '#1b639b'
            }
        ]
    },
	{
		'featureType': 'administrative.country',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'color': '#26628f'
            }
        ]
    },
	{
		'featureType': 'administrative.country',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'administrative.province',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'administrative.province',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'color': '#1a4e75'
            }
        ]
    },
	{
		'featureType': 'administrative.locality',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'administrative.locality',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'color': '#1a4e75'
            }
        ]
    },
	{
		'featureType': 'administrative.neighborhood',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'administrative.land_parcel',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'landscape',
		'elementType': 'all',
		'stylers': [
			{
				'color': '#093f5e'
            }
        ]
    },
	{
		'featureType': 'landscape',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'poi',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'poi',
		'elementType': 'geometry',
		'stylers': [
			{
				'color': '#0c4152'
            },
			{
				'lightness': 5
            }
        ]
    },
	{
		'featureType': 'road',
		'elementType': 'all',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'road.highway',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'color': '#000000'
            }
        ]
    },
	{
		'featureType': 'road.highway',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'color': '#0b434f'
            },
			{
				'lightness': 25
            }
        ]
    },
	{
		'featureType': 'road.highway',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'road.arterial',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'color': '#000000'
            }
        ]
    },
	{
		'featureType': 'road.arterial',
		'elementType': 'geometry.stroke',
		'stylers': [
			{
				'color': '#0b3d51'
            },
			{
				'lightness': 16
            }
        ]
    },
	{
		'featureType': 'road.arterial',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'road.local',
		'elementType': 'geometry',
		'stylers': [
			{
				'color': '#000000'
            }
        ]
    },
	{
		'featureType': 'road.local',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'transit',
		'elementType': 'all',
		'stylers': [
			{
				'color': '#146474'
            }
        ]
    },
	{
		'featureType': 'transit',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    },
	{
		'featureType': 'water',
		'elementType': 'all',
		'stylers': [
			{
				'color': '#223147'
            }
        ]
    },
	{
		'featureType': 'water',
		'elementType': 'geometry.fill',
		'stylers': [
			{
				'color': '#192a42'
            }
        ]
    },
	{
		'featureType': 'water',
		'elementType': 'labels',
		'stylers': [
			{
				'visibility': 'off'
            }
        ]
    }
];

export default style;
