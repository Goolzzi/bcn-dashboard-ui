'use strict';

jest.dontMock('../src/scripts/services/SiteGroupService');
jest.dontMock('jquery');
describe('SiteGroup Service', function () {

	var $ = require('jquery');

	var AuthStore = require('../src/scripts/stores/AuthStore')
		.default;
	var ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
		.default;
	var sut = require('../src/scripts/services/SiteGroupService')
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

	it('should verify jquery parameters when getAll function is called', function () {
		$.ajax()
			.resolve(['siteGroups']);

		return sut.getAll()
			.then(result => {
				expect(result)
					.toEqual(['siteGroups']);
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://localhost:3443/v1/api/customer/siteGroups',
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
	// createSiteGroup
	//
	//////////////////////

	it('should call correct endpoint with authentication token when createSiteGroup is called', function () {
		// avoid calling ajax() here so we can use .calls[0] later.
		ajaxPromise.resolve('return value not used here');

		var newSiteGroup = {
			name: 'ChicagoSite123',
			description: 'description of ChicagoSite123',
			siteIds: ['f23-d123d-fde1', 'at7-b143d-64e1'],
			policies: []
		};

		return sut.createSiteGroup(newSiteGroup)
			.then(() => {
				expect($.ajax.mock.calls[0][0].url)
					.toEqual('https://localhost:3443/v1/api/customer/siteGroups/create');
				expect($.ajax.mock.calls[0][0].contentType)
					.toEqual('application/json');
				expect($.ajax.mock.calls[0][0].headers)
					.toEqual({
						Authorization: 'Bearer token'
					});
				expect($.ajax.mock.calls[0][0].type)
					.toEqual('POST');
				expect(JSON.parse($.ajax.mock.calls[0][0].data))
					.toEqual(newSiteGroup);
			});
	});

	//////////////////////
	//
	// updateSiteGroup
	//
	//////////////////////

	it('should call correct endpoint with authentication token when updateSiteGroup is called', function () {
		// avoid calling ajax() here so we can use .calls[0] later.
		ajaxPromise.resolve('return value not used here');
		var updatedSiteGroup = {
			name: 'ChicagoSite123',
			description: 'description of ChicagoSite123',
			siteIds: ['f23-d123d-fde1', 'at7-b143d-64e1']
		};

		return sut.updateSiteGroup('1', updatedSiteGroup)
			.then(() => {
				expect($.ajax.mock.calls[0][0].url)
					.toEqual('https://localhost:3443/v1/api/customer/siteGroups/1/update');
				expect(JSON.parse($.ajax.mock.calls[0][0].data))
					.toEqual(updatedSiteGroup);

		});
	});

	//////////////////////
	//
	// deleteSiteGroup
	//
	//////////////////////

	it('should call correct endpoint with authentication token when deleteSiteGroup is called', function () {
		// avoid calling ajax() here so we can use .calls[0] later.
		ajaxPromise.resolve('return value not used here');

		const siteGroupId = 'y2a-ao2pd-82c1-1c23';
		return sut.deleteSiteGroup(siteGroupId)
			.then(() => {
				expect($.ajax.mock.calls[0][0].url)
					.toEqual('https://localhost:3443/v1/api/customer/siteGroups/'+ siteGroupId +'/delete');
				expect($.ajax.mock.calls[0][0].contentType)
					.toEqual('application/json');
				expect($.ajax.mock.calls[0][0].headers)
					.toEqual({
						Authorization: 'Bearer token'
					});
				expect($.ajax.mock.calls[0][0].type)
					.toEqual('POST');
			});
	});
});
