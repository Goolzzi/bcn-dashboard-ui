'use strict'
jest.dontMock('../src/scripts/stores/SiteGroupsStore');
jest.dontMock('events');
jest.dontMock('../src/scripts/constants/ActionTypes');
jest.dontMock('object-assign');
jest.dontMock('lodash');
jest.mock('../src/scripts/dispatchers/AppDispatcher');


describe('SiteGroupsStore', function () {

	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	let siteGroups = [
		{
			siteGroupId: 'fe761c49-14bc-478b-9839-fb5787ca8f67',
			name: 'Test 1',
			description: 'Test 1 description',
			siteIds: [],
			policies: []
		},
		{
			siteGroupId: '10e60984-e8fb-4070-844a-8a89c71759e6',
			name: 'Test 2',
			description: 'Test 2 description',
			siteIds: [],
			policies: []
		},
		{
			siteGroupId: '43e96d6b-4ccc-4887-91d9-c27f24665ec1',
			name: 'Test 3',
			description: 'Test 3 description',
			siteIds: [],
			policies: []
		},
		{
			siteGroupId: '57764868-b02f-4365-bd26-146dc8bb19a9',
			name: 'Test 4',
			description: 'Test 4 description',
			siteIds: [],
			policies: []
		}
		];

	let policies = [
		{
			name: 'Policy 1',
			description: 'Policy Test 1 description',
			},
		{
			name: 'Policy 2',
			description: 'Policy Test 2 description',
			},
		{
			name: 'Policy 3',
			description: 'Policy Test 3 description',
			}
		];


	const policyReturn = () => {
		callback({
			actionType: ActionTypes.SITEGROUPS_POLICY_RETURN,
			siteGroupId: "10e60984-e8fb-4070-844a-8a89c71759e6",
			policies: policies
		});
	};

	const policyBadReturn = () => {
		callback({
			actionType: ActionTypes.SITEGROUPS_POLICY_RETURN,
			siteGroupId: "1234",
			policies: policies
		});
	};

	const siteGroupsReturn = () => {
		callback({
			actionType: ActionTypes.SITEGROUPS_SET,
			siteGroups: [siteGroups[0], siteGroups[1], siteGroups[2]]
		});
	};

	let mockChangeListener = jest.genMockFunction();
	let sut, AppDispatcher, _, callback;
	beforeEach(function () {
		sut = require('../src/scripts/stores/SiteGroupsStore')
			.default;
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		_ = require('lodash');

		//mock the app dispatcher
		callback = AppDispatcher.register.mock.calls[0][0];
		_.throttle = jest.fn( function(func) {
			return func;
		});
		sut.addChangeListener(mockChangeListener);
	});

	afterEach(function () {
		sut.removeChangeListener(mockChangeListener);
	});

	it('should fetch groups when getAll SITEGROUPS_SET dispatched', function () {

		callback({
			actionType: ActionTypes.SITEGROUPS_SET,
			siteGroups: [siteGroups[0], siteGroups[1], siteGroups[2]]
		});

		expect(sut.getSiteGroups())
			.toEqual([siteGroups[0], siteGroups[1], siteGroups[2]]);
		expect(mockChangeListener)
			.toBeCalled();
	});

	it('should add and remove change listener', function () {
		siteGroupsReturn();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
		sut.removeChangeListener(mockChangeListener);
		siteGroupsReturn();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
	});

	it('should not update policy count', function () {
		policyBadReturn();
		expect(mockChangeListener)
			.not.toBeCalled();
	});

	it('should update policy count', function () {
		siteGroupsReturn();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(1);
		policyReturn();
		expect(mockChangeListener)
			.toHaveBeenCalledTimes(2);
	});

	// it('should throttle ui updates', function () {
	// 	jest.mock('lodash');

	// 	let siteGroupsList = [siteGroups[0], siteGroups[1], siteGroups[2]];

	// 	callback({
	// 		actionType: ActionTypes.SITEGROUPS_SET,
	// 		SiteGroups: siteGroupsList
	// 	});

	// 	policyReturn();
	// 	expect(_.throttle)
	// 		.toBeCalled();
	// });

	it('should add sitegroup when SITEGROUPS_CREATE is dispatched', function () {

		callback({
			actionType: ActionTypes.SITEGROUPS_CREATE,
			siteGroup: siteGroups[3]
		});

		expect(sut.getSiteGroups()[0])
			.toEqual(siteGroups[3]);
		expect(mockChangeListener)
			.toBeCalled();
	});

	it('should update sitegroup when SITEGROUPS_UPDATE is dispatched', function(){

		callback({
			actionType: ActionTypes.SITEGROUPS_SET,
			siteGroups: [ siteGroups[0], siteGroups[1] ]
		});

		let siteGroupUpdate = {
			name: 'Test Updated',
			description: 'Test description updated',
			siteIds: []
		};

		callback({
			actionType: ActionTypes.SITEGROUPS_UPDATE,
			siteGroupId: siteGroups[0].siteGroupId,
			siteGroup: siteGroupUpdate
		});

		expect(sut.getSiteGroups())
			.toContainEqual(Object.assign(siteGroupUpdate, { siteGroupId: siteGroups[0].siteGroupId, policies:[] }));

		expect(mockChangeListener)
			.toBeCalled();
	});

	it('should delete sitegroup when SITEGROUPS_DELETE is dispatched', function () {
		jest.unmock('lodash');
		sut.emitChange = jest.genMockFunction();
		let siteGroupsList = [siteGroups[0], siteGroups[1], siteGroups[2]];

		callback({
			actionType: ActionTypes.SITEGROUPS_SET,
			siteGroups: siteGroupsList
		});

		callback({
			actionType: ActionTypes.SITEGROUPS_DELETE,
			siteGroupId: siteGroups[1].siteGroupId
		});

		expect(sut.getSiteGroups())
			.toEqual([siteGroups[0], siteGroups[2]]);
		expect(sut.emitChange)
			.toBeCalled();
	});


	it('should update policies of sitegroup when SITEGROUPS_POLICY_RETURN is dispatched', function () {
		let siteGroupsList = [siteGroups[0], siteGroups[1], siteGroups[2]];
		callback({
			actionType: ActionTypes.SITEGROUPS_SET,
			siteGroups: siteGroupsList
		});

		callback({
			actionType: ActionTypes.SITEGROUPS_POLICY_RETURN,
			siteGroupId: siteGroups[1].siteGroupId,
			policies: policies
		});

		let sutSiteGroups = sut.getSiteGroups();
		expect(sutSiteGroups[1].policies)
			.toEqual(policies);
		expect(mockChangeListener)
			.toBeCalled();
	});

	it('should not be initialized at startup', function () {
		expect(sut.getInitialized())
			.toEqual(false);
	});

	it('should be initialized after sites are loaded', function () {
		callback({
			actionType: ActionTypes.SITEGROUPS_SET,
			siteGroups: [siteGroups[0], siteGroups[1], siteGroups[2]]
		});
		expect(sut.getInitialized())
			.toEqual(true);
	});

	it('should update sitegroup if SITEGROUPS_UPDATE is dispatched', function() {
		siteGroupsReturn();
		let updatedSiteGroup = siteGroups[0];
		updatedSiteGroup.name = "updatename";

		callback({
			actionType: ActionTypes.SITEGROUPS_UPDATE,
			siteGroupToUpdate: updatedSiteGroup
		});
		expect(sut.getSiteGroups()[0])
			.toEqual(updatedSiteGroup);

	});
});
