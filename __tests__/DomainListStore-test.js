'use strict'
jest.dontMock('../src/scripts/stores/DomainListStore');
jest.dontMock('events');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('object-assign');


describe('DomainListStore', function () {

	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	let domainLists = [
		{
			name: 'Test 1',
			description: 'Test 1 description',
			id: "1",
			domainCount: 4
		},
		{
			name: 'Test 2',
			description: 'Test 2 description',
			id: "2",
			domainCount: 5
		},
		{
			name: 'Test 3',
			description: 'Test 3 description',
			id: "3",
			domainCount: 6
		}
		];

	let policies = [
		{
			name: 'Test 1',
			description: 'Test 1 description',
			},
		{
			name: 'Test 2',
			description: 'Test 2 description',
			},
		{
			name: 'Test 3',
			description: 'Test 3 description',
			}
			];

	const setDomainLists = () => {
		callback({
			actionType: ActionTypes.DOMAINLISTS_SET,
			domainLists: domainLists
		});
	};

	const policyReturn = () => {
		callback({
			actionType: ActionTypes.DOMAINLISTS_POLICY_RETURN,
			id: "1",
			policies: policies
		});
	};

	const policyBadReturn = () => {
		callback({
			actionType: ActionTypes.DOMAINLISTS_POLICY_RETURN,
			id: "5",
			policies: policies
		});
	};

	let mockChangeListener = jest.genMockFunction();
	let sut, AppDispatcher, callback, throttledEmitChange, _;
	beforeEach(function () {
		sut = require('../src/scripts/stores/DomainListStore')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		_ = require('lodash');
		_.throttle = jest.fn( function(func) {
			return func;
		});

		//mock the app dispatcher
		callback = AppDispatcher.register.mock.calls[0][0];
		sut.addChangeListener(mockChangeListener);

	});

	afterEach(function () {
		sut.removeChangeListener(mockChangeListener);
	});


	it('should add and remove change listener', function () {
		setDomainLists();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
		sut.removeChangeListener(mockChangeListener);
		setDomainLists();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
	});

	it('should fetch domain lists when setDomainLists DOMAINLISTS_SET dispatched', function () {
		setDomainLists();
		expect(sut.getDomainLists())
			.toEqual(domainLists);
		expect(mockChangeListener)
			.toBeCalled();
	});

	it('should not update policy count', function () {
		policyBadReturn();
		expect(mockChangeListener)
			.not.toBeCalled();
	});

	it('should update policy count', function () {
		setDomainLists();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);

		policyReturn();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(2);
	});
});
