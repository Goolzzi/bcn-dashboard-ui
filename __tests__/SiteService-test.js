'use strict';

jest.dontMock('../src/scripts/services/SiteService');
jest.dontMock('jquery');

describe('SiteService', function () {

	var $ = require('jquery');

	var AuthStore = require('../src/scripts/stores/AuthStore')
		.default;
	var ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
		.default;

	var sut = require('../src/scripts/services/SiteService')
		.default;

	var ajaxPromise;

	beforeEach(() => {
		ajaxPromise = $.Deferred();
		$.ajax = jest.genMockFunction()
			.mockReturnValue(ajaxPromise);

		AuthStore.getToken = jest.genMockFunction()
			.mockReturnValue("token");
		ApiEndpointService.getCustomerApiEndpoint = jest.genMockFunction()
			.mockReturnValue(Promise.resolve({
				config: 'localhost:3443'
			}));
	});

	//////////////////////
	//
	// all
	//
	//////////////////////

	it('should verify jquery parameters when all function is called', function () {
		$.ajax()
			.resolve(['sites']);

		return sut.getAll()
			.then(result => {
				expect(result)
					.toEqual(['sites']);
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/customer/sites',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer token'
						},
						type: 'GET'
					});
			});
	});

	//////////////////////
	//
	// getAllSitesSummary
	//
	//////////////////////

	it('should verify jquery parameters when all function is called', function () {
		$.ajax()
			.resolve(['sites']);

		return sut.getSummary()
			.then(result => {
				expect(result)
					.toEqual(['sites']);
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/customer/sites?fields=siteName,siteId,location',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer token'
						},
						type: 'GET'
					});
			});
	});

	//////////////////////
	//
	// createSite
	//
	//////////////////////

	it('should call correct endpoint with authentication token when createSite is called', function () {
		// avoid calling ajax() here so we can use .calls[0] later.
		ajaxPromise.resolve('return value not used here');

		var newSite = {
			'siteName': 'siteA',
			'location': {
				'lat': '1.0',
				'lng': '2.0'
			}
		};

		return sut.createSite(newSite)
			.then(() => {
				expect($.ajax.mock.calls[0][0].url)
					.toEqual('https://localhost:3443/v1/api/customer/sites/create');
				expect($.ajax.mock.calls[0][0].contentType)
					.toEqual('application/json');
				expect($.ajax.mock.calls[0][0].headers)
					.toEqual({
						Authorization: 'Bearer token'
					});
				expect($.ajax.mock.calls[0][0].type)
					.toEqual('POST');
				expect(JSON.parse($.ajax.mock.calls[0][0].data))
					.toEqual(newSite);
			});
	});

	//////////////////////
	//
	// search
	//
	//////////////////////

	it('should call correct endpoint with authentication token when search is called', function () {
		$.ajax()
			.resolve(['some sites']);

		return sut.search('user-input', 17)
			.then(result => {
				expect(result)
					.toEqual(['some sites']);

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/customer/sites/search',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer token'
						},
						type: 'GET',
						data: {
							siteNameContains: 'user-input',
							desiredResultCount: 17
						}
					});
			});
	});

	//////////////////////
	//
	// getSite
	//
	//////////////////////

	it('should call correct endpoint with authentication token when site is got', function () {
		$.ajax()
			.resolve('some site');

		return sut.getSite('site name we would like to know about')
			.then(result => {
				expect(result)
					.toBe('some site');

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/customer/sites/get',
						headers: {
							Authorization: 'Bearer token'
						},
						type: 'GET',
						data: {
							siteName: 'site name we would like to know about'
						}
					});
			});
	});

	//////////////////////
	//
	// updateSite
	//
	//////////////////////

	it('updateSite makes REST call with correct parameters', function () {
		ajaxPromise.resolve('return value not used here');

		return sut.updateSite('site name', '2.3.5.7')
			.then(() => {
				expect($.ajax)
					.toBeCalled();

				expect($.ajax.mock.calls[0][0].url)
					.toEqual('https://localhost:3443/v1/api/customer/sites/update');
				expect($.ajax.mock.calls[0][0].contentType)
					.toEqual('application/json');
				expect($.ajax.mock.calls[0][0].headers)
					.toEqual({
						Authorization: 'Bearer token'
					});
				expect($.ajax.mock.calls[0][0].type)
					.toEqual('POST');

				var result = JSON.parse($.ajax.mock.calls[0][0].data);
				expect(result.siteName)
					.toEqual('site name');
				expect(result.settings.servers[0].ipAddress)
					.toEqual('2.3.5.7');
			});
	});

	it('updateSite to empty makes REST call with correct parameters', function () {
		ajaxPromise.resolve('return value not used here');

		return sut.updateSite('site name', '')
			.then(() => {
				expect($.ajax)
					.toBeCalled();

				expect($.ajax.mock.calls[0][0].url)
					.toEqual('https://localhost:3443/v1/api/customer/sites/update');
				expect($.ajax.mock.calls[0][0].contentType)
					.toEqual('application/json');
				expect($.ajax.mock.calls[0][0].headers)
					.toEqual({
						Authorization: 'Bearer token'
					});
				expect($.ajax.mock.calls[0][0].type)
					.toEqual('POST');

				var result = JSON.parse($.ajax.mock.calls[0][0].data);
				expect(result.siteName)
					.toEqual('site name');
				expect(result.settings.servers)
					.toEqual([]);
			});
	});

	it('fails updateSite when REST call fails', function () {
		ajaxPromise.reject('fake error');

		return sut.updateSite('site name', '')
			.then(() => {
				throw 'expected failure'
			}, () => {});
	});
});
