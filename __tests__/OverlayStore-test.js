'use strict'
jest.dontMock('../src/scripts/stores/OverlayStore');
jest.dontMock('events');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('object-assign');

describe('OverlayStore', function(){
    let ActionTypes = require('../src/scripts/constants/ActionTypes')
        .default;

    let callback;
    const changeView = () => {
        callback({
            actionType: ActionTypes.OVERLAY_CHANGE_VIEW,
            viewName: "sites"
        });
    };

    let mockChangeListener = jest.genMockFunction();
    let sut, AppDispatcher;

    beforeEach(function () {
        sut = require('../src/scripts/stores/OverlayStore')
            .default;
        AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');

        //mock the app dispatcher
        callback = AppDispatcher.register.mock.calls[0][0];
        sut.addChangeListener(mockChangeListener);
    });

    afterEach(function () {
        sut.removeChangeListener(mockChangeListener);
    });

    it('should set the currentPage', function(){
        changeView();
        expect(mockChangeListener)
          .toBeCalled();
        expect(sut.getCurrentPage())
          .toEqual("sites");
    });

    it('should add and remove change listener', function () {
        changeView();
        expect(mockChangeListener)
            .toHaveBeenCalledTimes(1);
        sut.removeChangeListener(mockChangeListener);
        changeView();
        expect(mockChangeListener)
            .toHaveBeenCalledTimes(1);
    });
});
