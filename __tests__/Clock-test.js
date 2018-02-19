jest.dontMock('../src/scripts/components/Clock/Clock');
jest.dontMock('../src/scripts/components/Clock/render.jsx');

describe('Map component tests', function () {
			let Clock = require('../src/scripts/components/Clock')
				.default;
			let ReactTestUtils = require('react-addons-test-utils');
			let ReactDOM = require('react-dom');
			let React = require('react');
			let MockDate = require('mockdate');

			var sut;
			var nodeClock, nodeHour, nodeMinute, nodeSecond;

			var renderClock = (isLive) => {
				sut = ReactTestUtils.renderIntoDocument( < Clock live = {
						isLive
					}
					/>);
					nodeClock = ReactDOM.findDOMNode(sut); nodeHour = nodeClock.querySelector('*[class="hour"]'); nodeMinute = nodeClock.querySelector('*[class="minute"]'); nodeSecond = nodeClock.querySelector('*[class="second"]');
				}

				beforeEach(function () {});

				it('should be rendered with elements for hour\minute\second', function () {
					renderClock(true);
					expect(nodeClock)
						.not.toBeNull();
					expect(nodeHour)
						.not.toBeNull();
					expect(nodeMinute)
						.not.toBeNull();
					expect(nodeSecond)
						.not.toBeNull();
				});

				it('should be register timer if live prop set to true', function () {
					renderClock(true);
					expect(setTimeout)
						.toBeCalledWith(sut.tick, 1000);
				});

				it('should not register timer if live prop set to true', function () {
					renderClock(false);
					expect(setTimeout)
						.not.toBeCalled();
				});

				it('should continously register timer when live set to true', function () {
					renderClock(true);
					expect(setTimeout)
						.toBeCalledWith(sut.tick, 1000);
					setTimeout.mockClear();
					jest.runOnlyPendingTimers();
					expect(setTimeout)
						.toBeCalledWith(sut.tick, 1000);
				});

				it('should not register timer if live prop set to true', function () {
					renderClock(false);
					expect(setTimeout)
						.not.toBeCalled();
				});

				it('should clear the timer on componentDidUpdate if live set to false', function () {
					renderClock(false);
					sut.timeoutId = 100;
					sut.componentDidUpdate({
						live: true
					});
					expect(clearTimeout)
						.toBeCalledWith(100);
				});

				it('should call tick on componentDidUpdate if live prop value changes', function () {
					renderClock(false);
					sut.timeoutId = 100;
					sut.tick = jest.fn(sut.tick);
					sut.componentDidUpdate({
						live: true
					});
					expect(sut.tick)
						.toBeCalled();
				});

				it('should clear time on componentWillUnmount if timer set', function () {
					renderClock(true);
					sut.componentWillUnmount();
					expect(clearTimeout)
						.toBeCalled();
				});

				it('should force an update if tick called with refresh set to false', function () {
					renderClock(true);
					sut.forceUpdate = jest.fn(sut.forceUpdate);
					sut.tick(false);
					expect(sut.forceUpdate)
						.toBeCalled();
				});

				it('should render the current system time', function () {
					var start = new Date();
					MockDate.set(start);
					renderClock(true);

					expect(parseInt(nodeHour.innerHTML, 10))
						.toEqual(start.getHours());
					expect(parseInt(nodeMinute.innerHTML, 10))
						.toEqual(start.getMinutes());
					expect(parseInt(nodeSecond.innerHTML, 10))
						.toEqual(start.getSeconds());

					MockDate.reset();

					//wait until the date changes
					var next = new Date();
					while (next.getSeconds() === start.getSeconds()) {
						next = new Date();
					}

					sut.tick(false);
					expect(parseInt(nodeHour.innerHTML, 10))
						.toEqual(next.getHours());
					expect(parseInt(nodeMinute.innerHTML, 10))
						.toEqual(next.getMinutes());
					expect(parseInt(nodeSecond.innerHTML, 10))
						.toEqual(next.getSeconds());
				});

			});
