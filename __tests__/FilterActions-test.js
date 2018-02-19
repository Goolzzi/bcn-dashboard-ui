jest.dontMock('../src/scripts/actions/FilterActions');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.unmock('../__testutils__/timeshift.js');


describe('FilterActions', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	let fromFilter = {
		'from': 1460615125000,
		'to': 0
	};

	let toFilter = {
		'from': 0,
		'to': 1460617505000
	};

	let fullFilter = {
		'from': 1460615125000,
		'to': 1460617505000
	};

	let atFilter = {
		from: 1460623225000,
		to: 1460623226000,
		siteName: null
	};

	let fromTime = '02:25:25';
	let toTime = '03:05:05';
	let atTime = '04:40:25';
	let futureNow = '17:54:45';

	var sut;
	var AppDispatcher;
	var FilterStore;
	var TimeShift = require('../__testutils__/timeshift.js');

	beforeEach(function () {
		sut = require('../src/scripts/actions/FilterActions')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		FilterStore = require('../src/scripts/stores/FilterStore')
			.default;

		Date = TimeShift.Date;
		TimeShift.setTime(1460670817000); // Thu Apr 14 17:53:37 EDT 2016
		TimeShift.setTimezoneOffset(4 * 60); // EDT
	});

	afterEach(function () {
		Date = TimeShift.OriginalDate;
	});

	it('should have from', function () {
		expect(sut.from)
			.toBeDefined();
	});

	it('should have to', function () {
		expect(sut.to)
			.toBeDefined();
	});

	it('should have at', function () {
		expect(sut.at)
			.toBeDefined();
	});

	it('should have deleteFilters', function () {
		expect(sut.deleteFilters)
			.toBeDefined();
	});

	it('should return false when from has invalid time', function () {
		expect(() => sut.from(null))
			.toThrow();
		expect(() => sut.from(''))
			.toThrow();
		expect(() => sut.from('xxx'))
			.toThrow();
	});

	it('should return false when to has invalid time', function () {
		expect(() => sut.to(null))
			.toThrow();
		expect(() => sut.to(''))
			.toThrow();
		expect(() => sut.to('yyy'))
			.toThrow();
	});

	it('should return false when at has invalid time', function () {
		expect(() => sut.at(null))
			.toThrow();
		expect(() => sut.at(''))
			.toThrow();
		expect(() => sut.at('zzz'))
			.toThrow();
	});

	it('should return false when site is set more than once', function () {
		sut.resetParams();
		sut.site('blah');
		expect(() => sut.site('aaaa'))
			.toThrow();
	});


	it('should return false when calling from on an existing from filter', function () {
		sut.resetParams();
		sut.from(fromTime);
		expect(() => sut.from(fromTime))
			.toThrow();
	});

	it('should return false when setting from date in the future', function () {
		sut.resetParams();
		expect(() => sut.from(futureNow))
			.toThrow();
	});

	it('should return false when calling from on an existing to filter', function () {
		sut.resetParams();
		sut.to(toTime);
		expect(() => sut.to(toTime))
			.toThrow();
	});

	it('should return false when setting to time in the future', function () {
		sut.resetParams();
		expect(() => sut.to(futureNow))
			.toThrow();
	});

	it('should return false when to time less than from', function () {
		sut.resetParams();
		sut.from(toTime);
		expect(() => sut.to(fromTime))
			.toThrow();
	});

	it('should return false when setting at time in the future', function () {
		sut.resetParams();
		expect(() => sut.at(futureNow))
			.toThrow();
	});

	it('should set new filter when setting at time', function () {
		FilterStore.getFilters = jest.genMockFunction()
			.mockImplementation(function () {
				return null;
			});

		sut.resetParams();
		sut.at(atTime);
		sut.executeAction();

		//expect(AppDispatcher.dispatch).toBeCalled();
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.FILTER_UPDATE,
				filters: {
					'from': 1460623225000,
					'to': 1460623226000
				}
			});
	});

	it('should set new filter when setting site name', function () {
		FilterStore.getFilters = jest.genMockFunction()
			.mockImplementation(function () {
				return null;
			});

		sut.resetParams();
		sut.site('Targa');
		sut.executeAction();

		//expect(AppDispatcher.dispatch).toBeCalled();
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.FILTER_UPDATE,
				filters: {
					siteName: 'Targa'
				}
			});
	});

	it('should set new filter when setting to, from and site', function () {
		FilterStore.getFilters = jest.genMockFunction()
			.mockImplementation(function () {
				return null;
			});

		sut.resetParams();
		sut.from(fromTime);
		sut.to(toTime);
		sut.site('Targa');
		sut.executeAction();

		//expect(AppDispatcher.dispatch).toBeCalled();
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.FILTER_UPDATE,
				filters: {
					from: 1460615125000,
					to: 1460617505000,
					siteName: 'Targa'
				}
			});
	});


	it('should call delete when deleting filter', function () {
		sut.deleteFilters();
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.FILTER_DELETE
			});

	});

	it('should call delete when an error occurs', function () {
		expect(() => sut.to('xxx'))
			.toThrow();
		expect(AppDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.FILTER_DELETE
			});

	});
});
