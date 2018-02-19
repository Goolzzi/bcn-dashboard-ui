'use strict'
jest.dontMock('../src/scripts/stores/PolicyStore');
jest.dontMock('events');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('object-assign');

describe('PolicyStore', function () {

	let policies = [{
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


	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	const getAll = () => {
		callback({
			actionType: ActionTypes.POLICIES_SET,
			policies: policies
		});
	};

	let mockChangeListener = jest.genMockFunction();
	let sut, AppDispatcher, callback;
	beforeEach(function () {
		sut = require('../src/scripts/stores/PolicyStore')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');

		//mock the app dispatcher
		callback = AppDispatcher.register.mock.calls[0][0];
		sut.addChangeListener(mockChangeListener);
	});

	afterEach(function () {
		sut.removeChangeListener(mockChangeListener);
	});

	it('should add and remove change listener', function () {
		getAll();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
		sut.removeChangeListener(mockChangeListener);
		getAll();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
	});

	it('should fetch policies when POLICIES_SET called', function () {
		getAll();
		expect(sut.getPolicies())
			.toEqual(policies);
	});
});
