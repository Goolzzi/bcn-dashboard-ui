jest.dontMock('../src/scripts/actions/ToastActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

describe('ToastActions', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var sut;
	var AppDispatcher;
	beforeEach(function () {
		sut = require('../src/scripts/actions/ToastActions')
			.default;
		//mock the app dispatcher
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
	});


	it('should dispatch the TOAST action when toast is called.', function () {

		var toastType = 'toastType';
		var toastText = 'toastText';

		sut.toast(toastType, toastText);

		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.TOAST,
				type: toastType,
				text: toastText
			});
	});

	it('should dispatch the TOAST_REMOVE action when remove is called.', function () {
		var toastId = 'id';
		sut.remove(toastId);
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.TOAST_REMOVE,
				key: toastId,
			});
	});

	it('should dispatch the TOAST_REMOVE_ALL action when remove is called.', function () {
		sut.removeAll();
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.TOAST_REMOVE_ALL
			});
	});

	it('should dispatch the TOAST_REMOVE_TYPE action when remove is called.', function () {
		sut.removeByType('test');
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.TOAST_REMOVE_TYPE,
				type: 'test'
			});
	});

});
