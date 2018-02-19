jest.dontMock('../src/scripts/actions/DnsQueryLogActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

describe('AuthActions', function () {
	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var mockResponse = ['WhatWhat?'];
	var mockError = 'mockerror'

	let sut = require('../src/scripts/actions/DnsQueryLogActions')
		.default;
	let DnsQueryLogService = require('../src/scripts/services/DnsQueryLogService')
		.default;
	let AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');

	///////////////////////////
	//
	// getInitialDnsQueryLogs
	//
	///////////////////////////

	it('fails getInitialDnsQueryLogs when DnsQueryLogService.queryOldLogs fails', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.reject('fake error'));

		return sut.getInitialDnsQueryLogs(10)
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('Dispatcher should be dispatched with correct param when getInitialDnsQueryLogs is called', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.getInitialDnsQueryLogs(10)
			.then(() => {

				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_INITIALIZE,
						dnsQueryLogs: mockResponse,
						hasMoreData: false
					});
			});
	});

	it('Dispatcher should be dispatched with correct param when getInitialDnsQueryLogs is called with fewer records', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.getInitialDnsQueryLogs(1)
			.then(() => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_INITIALIZE,
						dnsQueryLogs: mockResponse,
						hasMoreData: true
					});
			});
	});

	it('should dispatch DNSQUERIES_ERROR_HTTP with correct param when getInitialDnsQueryLogs fails', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.reject(mockError));

		return sut.getInitialDnsQueryLogs(10)
			.then(() => {
				throw 'expecting failure'
			}, () => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
						error: mockError
					});
			});

	});

	///////////////////////////
	//
	// isNewDataAvailable
	//
	///////////////////////////

	it('fails isNewDataAvailable when DnsQueryLogService.queryNewLogs fails', function () {
		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.reject('fake error'));

		return sut.isNewDataAvailable('test')
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('Dispatcher should be dispatched with correct param when isNewDataAvailable is called', function () {

		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.isNewDataAvailable('test')
			.then(() => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_NEW_DATA_AVAILABLE,
						dnsQueryLogs: mockResponse
					});
			});
	});

	it('should dispatch DNSQUERIES_ERROR_HTTP with correct param when isNewDataAvailable fails', function () {
		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.reject(mockError));

		return sut.isNewDataAvailable(10)
			.then(() => {
				throw 'expecting failure'
			}, () => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
						error: mockError
					});
			});
	});

	///////////////////////////
	//
	// getNewDnsQueryLogs
	//
	///////////////////////////

	it('fails getNewDnsQueryLogs when DnsQueryLogService.queryNewLogs fails', function () {
		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.reject('fake error'));

		return sut.getNewDnsQueryLogs('test', 10)
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('Dispatcher should be dispatched with correct param when getNewDnsQueryLogs is called', function () {
		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.getNewDnsQueryLogs('test', 10)
			.then(() => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ADD_NEW,
						dnsQueryLogs: mockResponse,
						hasMoreData: false
					});
			});
	});

	it('Dispatcher should be dispatched with correct param when getNewDnsQueryLogs is called with fewer records', function () {
		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.getNewDnsQueryLogs('test', 1)
			.then(() => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ADD_NEW,
						dnsQueryLogs: mockResponse,
						hasMoreData: true
					});
			});
	});

	it('should dispatch DNSQUERIES_ERROR_HTTP with correct param when getNewDnsQueryLogs fails', function () {
		DnsQueryLogService.queryNewLogs.mockReturnValue(Promise.reject(mockError));
		return sut.getNewDnsQueryLogs('test', 10)
			.then(() => {
				throw 'expecting failure'
			}, () => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
						error: mockError
					});
			});
	});

	///////////////////////////
	//
	// getOldDnsQueryLogs
	//
	///////////////////////////

	it('fails queryNewLogs when DnsQueryLogService.queryNewLogs fails', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.reject('fake error'));

		return sut.getOldDnsQueryLogs('test', 10)
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});

	it('Dispatcher should be dispatched with correct param when getOldDnsQueryLogs is called', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.getOldDnsQueryLogs('test', 10)
			.then(() => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ADD_OLD,
						dnsQueryLogs: mockResponse,
						hasMoreData: false
					});
			});
	});

	it('Dispatcher should be dispatched with correct param when getOldDnsQueryLogs is called with fewer records', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.resolve(mockResponse));

		return sut.getOldDnsQueryLogs('test', 1)
			.then(() => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ADD_OLD,
						dnsQueryLogs: mockResponse,
						hasMoreData: true
					});
			});
	});

	it('should dispatch DNSQUERIES_ERROR_HTTP with correct param when getOldDnsQueryLogs fails', function () {
		DnsQueryLogService.queryOldLogs.mockReturnValue(Promise.reject(mockError));

		return sut.getOldDnsQueryLogs('test', 10)
			.then(() => {
				throw 'expecting failure'
			}, () => {
				expect(AppDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.DNSQUERIES_ERROR_HTTP,
						error: mockError
					});
			});
	});

});
