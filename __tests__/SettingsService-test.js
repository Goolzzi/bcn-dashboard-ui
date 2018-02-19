jest.dontMock('../src/scripts/services/SettingsService.js');
jest.dontMock('jquery');

const sut = require('../src/scripts/services/SettingsService')
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

	it('Should verify jquery getSettings requests have valid parameters', () => {
		$.ajax()
			.resolve('something');
		return sut.getSettings()
			.then(() => {

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/spSettings/global',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + authStore.getToken()
						},
						type: 'GET'
					});
			});
	});

	it('should verify get factory settings is called with valid params', () => {
		$.ajax()
			.resolve('something');
		return sut.getFactorySettings()
			.then(() => {

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/spSettings/factory',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + authStore.getToken()
						},
						type: 'GET'
					});
			});
	});

	it('should verify update settings is called successfully', () => {
		const settings = {
			forwarding_dns_ip: '4.5.5.6'
		};

		$.ajax()
			.resolve(undefined);

		return sut.updateSettings(settings)
			.then(() => {

				expect($.ajax)
					.toBeCalledWith({
						url: 'https://customerApi/v1/api/spSettings/global/update',
						contentType: 'application/json',
						headers: {
							'Authorization': 'Bearer ' + authStore.getToken()
						},
						type: 'POST',
						data: JSON.stringify({
							servers: [{
								ipAddress: settings.forwarding_dns_ip
						}]
						})
					});
			});
	});
});
