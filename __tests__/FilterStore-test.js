jest.dontMock('../src/scripts/stores/FilterStore');
jest.dontMock('../src/scripts/constants/ActionTypes');

describe('FilterStore', function () {
	it('getFilters should return null when no filters are stored in session storage', function () {
		window.sessionStorage = {
			getItem: jest.genMockFunction()
				.mockReturnValue(null)
		};

		var sut = require('../src/scripts/stores/FilterStore')
			.default;

		expect(sut.getFilters())
			.toBe(null);
	});

	it('getFilters should return parsed object when a filter is stored as JSON', function () {
		window.sessionStorage = {
			getItem: jest.genMockFunction()
				.mockReturnValue('{ "filters": {} }')
		};

		var sut = require('../src/scripts/stores/FilterStore')
			.default;

		expect(sut.getFilters())
			.toEqual({});
	});

	it('should call this.emit when emitChange is called', function () {
		var sut = require('../src/scripts/stores/FilterStore')
			.default;

		sut.emit = jest.genMockFunction();

		sut.emitChange();

		expect(sut.emit)
			.toBeCalledWith('filter-changed');
	});

	it('should call this.on when addChangeListener is called', function () {
		var sut = require('../src/scripts/stores/FilterStore')
			.default;

		sut.on = jest.genMockFunction();

		var callback = function () {
			return true;
		};

		sut.addChangeListener(callback);

		expect(sut.on)
			.toBeCalledWith('filter-changed', callback);
	});

	it('should call this.removeListener when removeChangeListener is called', function () {
		var sut = require('../src/scripts/stores/FilterStore')
			.default;

		sut.removeListener = jest.genMockFunction();

		var callback = function () {
			return true;
		};

		sut.removeChangeListener(callback);

		expect(sut.removeListener)
			.toBeCalledWith('filter-changed', callback);
	});

	it('should update stored filters when FILTER_UPDATE is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		window.sessionStorage = {
			setItem: jest.genMockFunction()
		};

		var sut = require('../src/scripts/stores/FilterStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var callback = AppDispatcher.register.mock.calls[0][0];

		callback({
			actionType: ActionTypes.FILTER_UPDATE,
			filters: {
				siteName: 'aa'
			},
			commandText: '/site aa'
		});

		expect(window.sessionStorage.setItem)
			.toBeCalledWith('filters', '{"filters":{"siteName":"aa"},"commandText":"/site aa"}');
		expect(sut.emitChange)
			.toBeCalled();
	});

	it('should remove stored filters when FILTER_DELETE is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		window.sessionStorage = {
			removeItem: jest.genMockFunction()
		};

		var sut = require('../src/scripts/stores/FilterStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var callback = AppDispatcher.register.mock.calls[0][0];

		callback({
			actionType: ActionTypes.FILTER_DELETE
		});

		expect(window.sessionStorage.removeItem)
			.toBeCalledWith('filters');
		expect(sut.emitChange)
			.toBeCalled();
	});

	it('should do nothing when unrelated action is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');

		window.sessionStorage = {
			setItem: jest.genMockFunction(),
			removeItem: jest.genMockFunction()
		};

		var sut = require('../src/scripts/stores/FilterStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var callback = AppDispatcher.register.mock.calls[0][0];

		callback({
			actionType: 'test'
		});

		expect(window.sessionStorage.setItem)
			.not.toBeCalled();
		expect(window.sessionStorage.removeItem)
			.not.toBeCalled();

		expect(sut.emitChange)
			.not.toBeCalled();
	});
});
