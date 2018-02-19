jest.dontMock('../src/scripts/services/PolicyService.js');
jest.dontMock('jquery');

const sut = require('../src/scripts/services/PolicyService')
	.default;
const authStore = require('../src/scripts/stores/AuthStore')
	.default;
const $ = require('jquery');
const ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
	.default;

describe('Policy Service Test', () => {

	beforeEach(() => {
		$.ajax = jest.genMockFunction()
			.mockReturnValue($.Deferred());

		authStore.getToken = jest.genMockFunction()
			.mockReturnValue("token");
		ApiEndpointService.getCustomerApiEndpoint.mockReturnValue(Promise.resolve({
			config: 'customerApi'
		}));
	});

	it('Should verify active policies associated to domainList associated request has correct parameters', () => {
		$.ajax()
			.resolve('something');

		var domainListId = 'testDomainListId';
		return sut.getPoliciesForDomainList(domainListId)
			.then(result => {
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/policyManagement/policies?domainListId=testDomainListId',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + authStore.getToken()
						},
						type: 'GET',
					});
			});
	});


	it('Should verify policies associated to site groups associated request has correct parameters', () => {
		$.ajax()
			.resolve('something');

		var siteGroupId = 'testSiteGroupId';
		return sut.getPoliciesForSiteGroup(siteGroupId)
			.then(result => {
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/policyManagement/policies?siteGroupId=testSiteGroupId',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + authStore.getToken()
						},
						type: 'GET',
					});
			});
	});

	//////////////////////
	//
	// all
	//
	//////////////////////

	it('should verify jquery parameters when getAll function is called', function () {
		$.ajax()
			.resolve(['policies']);

		return sut.getAll()
			.then(result => {
				expect(result)
					.toEqual(['policies']);
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/policyManagement/policies',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer ' + authStore.getToken()
						},
						type: 'GET'
					});
			});
	});

});
