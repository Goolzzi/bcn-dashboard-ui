jest.dontMock('../src/scripts/actions/SettingsActions');
jest.dontMock('../src/scripts/constants/ActionTypes');
const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;


describe('Settings Actions', () => {
	let appDispatcher;
	let sut;
	beforeEach(() => {
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		sut = require('../src/scripts/actions/SettingsActions')
			.default;
	})

	it('should verify show settings was called when show is invoked ', () => {
		sut.show('node')
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.SETTINGS_SHOW
			})
	})

	it('should verify hide settings was called when hide is invoked ', () => {
		sut.hide()
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.SETTINGS_HIDE
			})
	})
})
