jest.dontMock('../src/scripts/actions/TimerActions');

describe('Map component tests', function () {
	var sut = require('../src/scripts/actions/TimerActions')
		.default;

	it('should resolve when timer completes', function () {
		var p = sut.timer(100);
		jest.runAllTimers();
		return p;
	});
});
