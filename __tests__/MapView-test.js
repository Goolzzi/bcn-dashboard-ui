jest.dontMock('../src/scripts/router/routes/App/routes/Map/components/MapView');
jest.dontMock('../src/scripts/router/routes/App/routes/Map/components/render.jsx');

describe('Map component tests', function () {
	let MapView = require('../src/scripts/router/routes/App/routes/Map/components/MapView')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');

	var googleMock = {
		maps: {
			'test': 'object'
		}
	}

	var sut;
	beforeEach(function () {
		window.google = googleMock;
	});

	it('should set isGoogleMapLoaded to true when mounted if window object is located', function () {
		window.google = googleMock;
		sut = ReactTestUtils.renderIntoDocument( < MapView / > );
		expect(sut.state.isGoogleMapLoaded)
			.toEqual(true);
	});

	it('should set a timer to check for window object availability if google map window not yet available', function () {
		window.google.maps = 0xBAD;
		sut = ReactTestUtils.renderIntoDocument( < MapView / > );
		expect(sut.state.isGoogleMapLoaded)
			.toEqual(false);
		expect(setTimeout)
			.toBeCalledWith(sut._handleCheckGoogleMap, 500)
	});

	it('should reset the timer if isGoogleMapLoaded returns false', function () {
		window.google.maps = 0xBAD;

		sut = ReactTestUtils.renderIntoDocument( < MapView / > );

		expect(sut.state.isGoogleMapLoaded)
			.toEqual(false);
		expect(setTimeout)
			.toBeCalledWith(sut._handleCheckGoogleMap, 500)

		jest.runOnlyPendingTimers();

		expect(setTimeout)
			.toBeCalledWith(sut._handleCheckGoogleMap, 500)
	});

	it('should not reset the timer if isGoogleMapLoaded returns true', function () {
		window.google.maps = 0xBAD;

		sut = ReactTestUtils.renderIntoDocument( < MapView / > );

		expect(sut.state.isGoogleMapLoaded)
			.toEqual(false);
		expect(setTimeout)
			.toBeCalledWith(sut._handleCheckGoogleMap, 500)

		jest.runOnlyPendingTimers();

		expect(setTimeout)
			.toBeCalledWith(sut._handleCheckGoogleMap, 500)

		window.google.maps = {
			"test": "object"
		};

		setTimeout.mockClear();
		jest.runOnlyPendingTimers();

		expect(sut.state.isGoogleMapLoaded)
			.toEqual(true);
		expect(setTimeout)
			.not.toBeCalled();
	});


});
