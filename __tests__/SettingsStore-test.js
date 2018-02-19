'use strict'
jest.dontMock('../src/scripts/stores/SettingsStore');
jest.dontMock('../src/scripts/constants/ActionTypes');

jest.dontMock('object-assign');
jest.mock('../src/scripts/dispatchers/AppDispatcher');

describe('SettingsStore', function () {

	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;
	const showSettings = () => {
		callback({
			actionType: ActionTypes.SETTINGS_SHOW,
		});
	};

	const hideSettings = () => {
		callback({
			actionType: ActionTypes.SETTINGS_HIDE,
		});
	};

	let mockChangeListener = jest.genMockFunction();
	let callback, sut, AppDispatcher;

	beforeEach(function () {
		sut = require('../src/scripts/stores/SettingsStore')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');

		//mock the app dispatcher
		callback = AppDispatcher.register.mock.calls[0][0];
		sut.addChangeListener(mockChangeListener);
	});

	it('should show settings when /settings', function () {
		showSettings()
		expect(sut.getIsShown())
			.toBeTruthy()
		expect(mockChangeListener)
			.toBeCalled()
	});

	it('should hide settings when closed', function () {
		hideSettings()
		expect(sut.getIsShown())
			.toBeFalsy()
		expect(mockChangeListener)
			.toBeCalled()
	});

});
