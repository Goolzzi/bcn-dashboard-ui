jest.dontMock('../src/scripts/logger/logger');

describe('Logger tests', function () {

    var sut;
	beforeEach(function () {
        window.sessionStorage = {
			getItem: jest.genMockFunction()
				.mockReturnValue('true')
		};

        console.log = jest.genMockFunction();
		sut = require('../src/scripts/logger/logger')
			.default;
	});

	it('log error should prefix with ERROR', function () {
		const logger = sut.getLogger('Foo');
		logger.logError('');
		expect(console.log)
			.toBeCalledWith("[ERROR] [Foo] ");
	});

	it('log info should prefix with INFO', function () {
		const logger = sut.getLogger('Foo');
		logger.logInfo('');
		expect(console.log)
			.toBeCalledWith("[INFO] [Foo] ");
	});

	it('if enabled log debug should prefix with DEBUG', function () {
		const logger = sut.getLogger('Foo');
		logger.logDebug('');
		expect(console.log)
			.toBeCalledWith("[DEBUG] [Foo] ");
	});

	it('if not enabled log debug should not log anything', function () {
		window.sessionStorage.getItem.mockReturnValue('false');
		const logger = sut.getLogger('Foo');
		logger.logDebug('');
		expect(console.log)
			.not.toBeCalled();
	});

	it('if not explicitly enabled log debug should not log anything', function () {
		window.sessionStorage.getItem.mockReturnValue(undefined)
		const logger = sut.getLogger('Foo');
		logger.logDebug('');
		expect(console.log)
			.not.toBeCalled();
	});
});
