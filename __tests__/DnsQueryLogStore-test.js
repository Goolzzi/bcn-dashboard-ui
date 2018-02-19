jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('../src/scripts/stores/DnsQueryLogStore');

describe('DnsQueryLogStore', function () {
	it('get should return []', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		expect(sut.getQueryLogs())
			.toEqual([]);
	});

	it('get start key should return null', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		expect(sut.getStartKey())
			.toEqual(null);
	});

	it('getIsMoreOldLogsAvailable should return null', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		expect(sut.getIsMoreOldLogsAvailable())
			.toEqual(false);
	});

	it('getEndKey should return null', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		expect(sut.getEndKey())
			.toEqual(null);
	});


	it('should call this.emit when emitChange is called', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		sut.emit = jest.genMockFunction();

		sut.emitChange();

		expect(sut.emit)
			.toBeCalledWith('alert-types-change');
	});

	it('should call this.on when addChangeListener is called', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		sut.on = jest.genMockFunction();

		var callback = function () {
			return true;
		};

		sut.addChangeListener(callback);

		expect(sut.on)
			.toBeCalledWith('alert-types-change', callback);
	});

	it('should call this.removeListener when removeChangeListener is called', function () {
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;

		sut.removeListener = jest.genMockFunction();

		var callback = function () {
			return true;
		};

		sut.removeChangeListener(callback);

		expect(sut.removeListener)
			.toBeCalledWith('alert-types-change', callback);
	});

	it('should set isNewDataAvailable when DNSQUERIES_NEW_DATA_AVAILABLE is dispatched with new logs', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var mockDNSLogs = [{
			'test': 'value'
		}];

		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_NEW_DATA_AVAILABLE,
			dnsQueryLogs: mockDNSLogs
		});

		expect(sut.getQueryLogs())
			.toEqual([]);
		expect(sut.getStartKey())
			.toEqual(null);
		expect(sut.getEndKey())
			.toEqual(null);
		expect(sut.isNewDataAvailable())
			.toEqual(true);
		expect(sut.emitChange)
			.toBeCalled();
	});

	it('should initialize store when DNSQUERIES_INITIALIZE dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		// verify start and end not set.
		expect(sut.getStartKey())
			.toEqual(null);
		expect(sut.getEndKey())
			.toEqual(null);

		var mockRecords = [];
		for (var k = 100; k < 400; ++k) {
			mockRecords.unshift({
				'recordId': k,
				'query': 'www.' + k + '.com'
			});
		}
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_INITIALIZE,
			dnsQueryLogs: mockRecords,
			hasMoreData: false
		});

		expect(sut.getQueryLogs())
			.toEqual(mockRecords);
		expect(sut.getQueryLogs()
				.length)
			.toEqual(300); // MAX_QUERYLOGS_BUFFER
		expect(sut.getNumQueryLogsAdded())
			.toEqual(300);
		expect(sut.getStartKey())
			.toEqual(399);
		expect(sut.getEndKey())
			.toEqual(null);
		expect(sut.emitChange)
			.toBeCalled();

	});

	it('should initialize store with EndKey when DNSQUERIES_INITIALIZE dispatched and more data available', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		// verify start and end not set.
		expect(sut.getStartKey())
			.toEqual(null);
		expect(sut.getEndKey())
			.toEqual(null);

		var mockRecords = [];
		for (var k = 100; k < 400; ++k) {
			mockRecords.unshift({
				'recordId': k,
				'query': 'www.' + k + '.com'
			});
		}
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_INITIALIZE,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});

		expect(sut.getQueryLogs())
			.toEqual(mockRecords);
		expect(sut.getIsMoreNewLogsAvailable())
			.toEqual(false);
		expect(sut.getQueryLogs()
				.length)
			.toEqual(300); // MAX_QUERYLOGS_BUFFER
		expect(sut.getNumQueryLogsAdded())
			.toEqual(300);
		expect(sut.getStartKey())
			.toEqual(399);
		expect(sut.getEndKey())
			.toEqual(100);
		expect(sut.emitChange)
			.toBeCalled();
	});

	it('should reset MoreLogsAvailable when DNSQUERIES_INITIALIZE is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;
		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var mockDNSLogs = [{
			'test': 'value'
		}];

		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_NEW_DATA_AVAILABLE,
			dnsQueryLogs: mockDNSLogs
		});
		expect(sut.isNewDataAvailable())
			.toEqual(true);

		var mockRecords = [];
		for (var k = 100; k < 400; ++k) {
			mockRecords.unshift({
				'recordId': k,
				'query': 'www.' + k + '.com'
			});
		}

		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_INITIALIZE,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});
		expect(sut.isNewDataAvailable())
			.toEqual(false);
	});

	it('should update stored DNS queries when DNSQUERIES_ADD_OLD is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var mockRecords = [{
			'test': 'value'
		}];
		var callback = AppDispatcher.register.mock.calls[0][0];

		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_OLD,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});

		expect(sut.getQueryLogs())
			.toEqual(mockRecords);
		expect(sut.getNumQueryLogsAdded())
			.toEqual(1);
		expect(sut.emitChange)
			.toBeCalled();
	});

	it('should update store and keep MAX_QUERYLOGS_BUFFER when DNSQUERIES_ADD_OLD is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		// verify start and end not set.
		expect(sut.getStartKey())
			.toEqual(null);
		expect(sut.getEndKey())
			.toEqual(null);

		var mockRecords = [];
		for (var k = 100; k < 500; ++k) {
			mockRecords.unshift({
				'recordId': k,
				'query': 'www.' + k + '.com'
			});
		}
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_OLD,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});

		expect(sut.getQueryLogs())
			.toEqual(mockRecords);
		expect(sut.getQueryLogs()
				.length)
			.toEqual(400); // MAX_QUERYLOGS_BUFFER
		expect(sut.getNumQueryLogsAdded())
			.toEqual(400);
		expect(sut.getStartKey())
			.toEqual(499);
		expect(sut.getEndKey())
			.toEqual(100);
		expect(sut.emitChange)
			.toBeCalled();

		mockRecords = [];
		mockRecords.push({
			'recordId': 99,
			'query': 'www.99.com'
		});
		mockRecords.push({
			'recordId': 98,
			'query': 'www.98.com'
		});
		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_OLD,
			dnsQueryLogs: mockRecords,
			hasMoreData: false
		});

		expect(sut.getQueryLogs()
				.length)
			.toEqual(400); // MAX_QUERYLOGS_BUFFER
		expect(sut.getNumQueryLogsAdded())
			.toEqual(2);
		expect(sut.getStartKey())
			.toEqual(497);
		expect(sut.getEndKey())
			.toEqual(null);
		expect(sut.emitChange)
			.toBeCalled();

	});

	it('should report more old data available when DNSQUERIES_ADD_OLD is dispatched with flag set', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var nextKeyValue = '1';
		var mockRecords = [{
			'test': 'value',
			'recordId': nextKeyValue
		}];
		var callback = AppDispatcher.register.mock.calls[0][0];

		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_OLD,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});

		expect(sut.getEndKey())
			.toEqual(nextKeyValue);
		expect(sut.getIsMoreOldLogsAvailable())
			.toEqual(true);
		expect(sut.emitChange)
			.toBeCalled();
	});


	it('should update stored DNS queries when DNSQUERIES_ADD_NEW is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var mockRecords = [{
			'recordId': 100,
			'query': 'blah'
		}];
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_NEW,
			dnsQueryLogs: mockRecords,
			hasMoreData: false
		});

		expect(sut.getQueryLogs())
			.toEqual(mockRecords);
		expect(sut.getNumQueryLogsAdded())
			.toEqual(1);
		expect(sut.getStartKey())
			.toEqual(100);
		expect(sut.getEndKey())
			.toEqual(100);
		expect(sut.emitChange)
			.toBeCalled();

		for (var k = 101; k < 501; ++k) {
			mockRecords.unshift({
				'recordId': k,
				'query': 'www.' + k + '.com'
			});
		}
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_NEW,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});

		// Disable for now until we sort out behavior
		//expect(sut.getIsMoreNewLogsAvailable()).toEqual(false);

		expect(sut.getQueryLogs()
				.length)
			.toEqual(400);
		expect(sut.getNumQueryLogsAdded())
			.toEqual(400);
		expect(sut.getStartKey())
			.toEqual(500);
		expect(sut.getEndKey())
			.toEqual(101);
		expect(sut.emitChange)
			.toBeCalled();

	});


	it('should do nothing when unrelated action is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var callback = AppDispatcher.register.mock.calls[0][0];

		callback({
			actionType: 'test'
		});

		expect(sut.getQueryLogs())
			.toEqual([]);
		expect(sut.emitChange)
			.not.toBeCalled();
	});

	it('should return false from more data available getters after DNSQUERIES_ERROR_HTTP is dispatched', function () {
		var AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		var ActionTypes = require('../src/scripts/constants/ActionTypes')
			.default;

		var sut = require('../src/scripts/stores/DnsQueryLogStore')
			.default;
		sut.emitChange = jest.genMockFunction();

		var mockRecords = [{
			'recordId': 100,
			'query': 'blah'
		}];
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_ADD_NEW,
			dnsQueryLogs: mockRecords,
			hasMoreData: true
		});

		expect(sut.getIsMoreOldLogsAvailable())
			.toEqual(true);
		expect(sut.getIsMoreNewLogsAvailable())
			.toEqual(true);

		var mockRecords = [{
			'recordId': 100,
			'query': 'blah'
		}];
		var callback = AppDispatcher.register.mock.calls[0][0];
		callback({
			actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
			error: 'error'
		});
		expect(sut.getIsMoreOldLogsAvailable())
			.toEqual(false);
		expect(sut.getIsMoreNewLogsAvailable())
			.toEqual(false);
		expect(sut.emitChange)
			.toBeCalled();
	});
});
