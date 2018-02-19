'use strict';

jest.dontMock('../src/scripts/services/DnsQueryLogService');
jest.dontMock('jquery'); // because we need $.Deferred

describe('DnsQueryLogService', function () {

	var $ = require('jquery');

	var AuthStore = require('../src/scripts/stores/AuthStore')
		.default;
	var FilterStore = require('../src/scripts/stores/FilterStore')
		.default;
	var ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
		.default;
	var sut = require('../src/scripts/services/DnsQueryLogService')
		.default;

	var ajaxPromise;

	beforeEach(() => {
		ApiEndpointService.getCustomerApiEndpoint.mockReturnValue(Promise.resolve({
			config: 'localhost:3443'
		}));
		AuthStore.getToken.mockReturnValue("token");

		ajaxPromise = $.Deferred();
		$.ajax = jest.fn(() => {
			return ajaxPromise;
		});
	});

	it('should verify jquery parameters when queryNewLogs function is called', function () {
		ajaxPromise.resolve(['First item', 'Second item']);

		return sut.queryNewLogs(123, 100)
			.then(resp => {
				expect($.ajax)
					.toBeCalledWith({
						type: 'GET',
						url: 'https://localhost:3443/v1/api/customer/dnsQueryLog',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer token'
						},
						data: {
							batchSize: 100,
							key: 123,
							order: 'ASC'
						}
					});
				expect(resp)
					.toEqual(['Second item', 'First item']);
			});
	});


	it('should verify jquery parameters when queryOldLogs function is called', function () {
		ajaxPromise.resolve(['First item', 'Second item']);
		return sut.queryOldLogs(123, 100)
			.then(resp => {
				expect(resp)
					.toEqual(['First item', 'Second item']);
				expect($.ajax)
					.toBeCalledWith({
						type: 'GET',
						url: 'https://localhost:3443/v1/api/customer/dnsQueryLog',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer token'
						},
						data: {
							batchSize: 100,
							key: 123,
							order: 'DESC'
						}
					});
			});
	});

	it('should return data in reverse order when getting newer', function () {
		var ajaxPromise = $.Deferred();
		$.ajax = function (params) {
			expect(params.url)
				.toEqual('https://localhost:3443/v1/api/customer/dnsQueryLog');
			expect(params.data.order)
				.toEqual('ASC');
			return ajaxPromise;
		};
		ajaxPromise.resolve(['First item', 'Second item']);
		return sut.queryNewLogs(123, 100)
			.then(resp => {
				expect(resp)
					.toEqual(['Second item', 'First item']);
			});
	});





	/*
	
	I don't know how I'm supposed to properly test promise objects that don't return at all.


	it('should abort outstanding requests when cancelActiveRequests is called', function () {
		// abort will cancel the actual request, and also cause the promise to fail
		// with this status text.
		ajaxPromise.abort = jest.fn(() => ajaxPromise.fail({statusText:'abort'}));

		var ajaxPromise = $.Deferred();
		ajaxPromise.abort = jest.fn(() => {});

		var endpointPromise = $.Deferred();
		endpointPromise.abort = jest.fn(() => {});

		$.ajax = jest.fn(() => {
			return ajaxPromise;
		});

		ApiEndpointService.getCustomerApiEndpoint = () => endpointPromise;
		AuthStore.getToken = jest.genMockFunction()
			.mockReturnValue("token");
		var responses = [];
		sut.queryOldLogs(123, 100);

		// resolve not complete
		sut.cancelActiveRequests();
		expect(endpointPromise.abort)
			.toBeCalled();

		// resolve complete
		endpointPromise.resolve({
			config: 'localhost:3443'
		});
		sut.cancelActiveRequests();
		expect(ajaxPromise.abort)
			.toBeCalled();

	});

	it('should call rest of promise fail chain when request has error', function () {
		var ajaxPromise = $.Deferred();
		var endpointPromise = $.Deferred();
		$.ajax = jest.fn(() => {
			return ajaxPromise;
		});

		ApiEndpointService.getCustomerApiEndpoint = () => endpointPromise.promise();
		AuthStore.getToken = jest.genMockFunction()
			.mockReturnValue("token");
		var failHandler = jest.fn(() => {});
		sut.queryOldLogs(123, 100)
			.fail(failHandler);

		endpointPromise.resolve({
			config: 'localhost:3443'
		});

		ajaxPromise.reject({
			statusText: ''
		});
		expect(failHandler)
			.toBeCalled();
	});


	it('should avoid calling rest of promise chain when request is aborted', function () {
		var ajaxPromise = $.Deferred();
		var endpointPromise = $.Deferred();
		$.ajax = jest.fn(() => {
			return ajaxPromise;
		});

		ApiEndpointService.getCustomerApiEndpoint = () => endpointPromise.promise();
		AuthStore.getToken = jest.genMockFunction()
			.mockReturnValue("token");
		var failHandler = jest.fn(() => {});
		sut.queryOldLogs(123, 100)
			.fail(failHandler);

		endpointPromise.resolve({
			config: 'localhost:3443'
		});

		ajaxPromise.reject({
			statusText: 'abort'
		});
		expect(failHandler)
			.not.toBeCalled();
	});
	*/

});
