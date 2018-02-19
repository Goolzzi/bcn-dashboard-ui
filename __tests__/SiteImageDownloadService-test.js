jest.dontMock('../src/scripts/services/SiteImageDownloadService.js');
jest.dontMock('jquery');

const sut = require('../src/scripts/services/SiteImageDownloadService')
	.default;
const authStore = require('../src/scripts/stores/AuthStore')
	.default;
const $ = require('jquery');
const ApiEndpointService = require('../src/scripts/services/ApiEndpointService')
	.default;

describe('Settings Service Test', () => {

	beforeEach(() => {
		$.ajax = jest.genMockFunction()
			.mockReturnValue($.Deferred());

		ApiEndpointService.getCustomerApiEndpoint.mockReturnValue(Promise.resolve({
			config: 'customerApi'
		}));
	});

	it('Should verify site image download request has correct parameters', () => {
		$.ajax()
			.resolve('response');

		var siteId = 'testSite';
		return sut.requestSiteImage(siteId)
			.then(() => {

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v2/api/spImage/generate',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + authStore.getToken()
						},
						type: 'POST',
						data: JSON.stringify({
							siteId: siteId
						})
					});
			});
	});

});
