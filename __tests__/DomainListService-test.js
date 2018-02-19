jest.dontMock('../src/scripts/services/DomainListService.js');
jest.dontMock('jquery');

const sut = require('../src/scripts/services/DomainListService')
	.default;
const authStore = require('../src/scripts/stores/AuthStore')
	.default;
const $ = require('jquery');
const ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
	.default;

describe('Domain Service Test', () => {

	beforeEach(() => {
		$.ajax = jest.genMockFunction()
			.mockReturnValue($.Deferred());

		authStore.getToken = jest.genMockFunction()
			.mockReturnValue("token");
		ApiEndpointService.getCustomerApiEndpoint.mockReturnValue(Promise.resolve({
			config: 'customerApi'
		}));
	});

	//////////////////////
	//
	// all
	//
	//////////////////////

	it('should verify jquery parameters when getAll function is called', function () {
		$.ajax()
			.resolve(['domainList']);

		return sut.getAll()
			.then(result => {
				expect(result)
					.toEqual(['domainList']);
				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/list/dns',
						contentType: 'application/json',
						headers: {
							Authorization: 'Bearer ' + authStore.getToken()
						},
						type: 'GET'
					});
			});
	});

});
