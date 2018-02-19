jest.dontMock('../src/scripts/stores/CustomerNameStore');

describe('DnsQueryLogStore', function () {

	it('get should return customer name', function () {
		window.customerName = 'WaterBotttle inc';
		var sut = require('../src/scripts/stores/CustomerNameStore')
			.default;

		expect(sut.getCustomerName()
				.length)
			.toBeGreaterThan(0);
	});

	it('get should return empty string', function () {
		window.customerName = '';
		var sut = require('../src/scripts/stores/CustomerNameStore')
			.default;

		expect(sut.getCustomerName()
				.length)
			.toBe(0);
	});
});
