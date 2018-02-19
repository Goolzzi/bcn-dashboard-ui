jest.unmock('../src/scripts/components/SiteGroups/SiteGroups');
jest.unmock('../src/scripts/components/SiteGroups/SiteGroupForm');
jest.unmock('../src/scripts/components/SiteGroups/render.jsx');
jest.unmock('../src/scripts/components/Overlay/Overlay');
jest.unmock('../src/scripts/components/Overlay/render.jsx');
jest.unmock('../src/scripts/components/DataTable/DataTable');
jest.unmock('../src/scripts/components/DataTable/render.jsx');

jest.unmock('stable');
jest.unmock('lodash');
jest.unmock('natural-compare-lite');

import {
	shallow
} from 'enzyme';
import {
	mount
} from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import naturalCompare from 'natural-compare-lite';
import deferred from '../__testutils__/deferred';
import _ from 'lodash';

import DataTable from '../src/scripts/components/DataTable/DataTable';
import Overlay from '../src/scripts/components/Overlay/Overlay';
import SiteGroupActions from '../src/scripts/actions/SiteGroupActions';
import ToastActions from '../src/scripts/actions/ToastActions';
import SiteGroupStore from '../src/scripts/stores/SiteGroupsStore';
import SiteGroups from '../src/scripts/components/SiteGroups/SiteGroups';
import SiteGroupForm from '../src/scripts/components/SiteGroups/SiteGroupForm';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import UserStore from '../src/scripts/stores/UserStore';
import SiteStore from '../src/scripts/stores/SiteStore';

describe('SiteGroup component tests', function () {

	var createSiteGroup = (siteName, siteDescription, siteIds, policies) => {
		return {
			name: siteName,
			description: siteDescription,
			siteIds: siteIds,
			policies: policies
		};
	};

	let testSiteGroups = [createSiteGroup('siteGroupA', 'siteGroupADescription', ['45d-h4564-67fg', '3563-345gb-sgs43'], ['policy']),
                     	createSiteGroup('siteGroupB', 'siteGroupBDescription', ['fghn56-976khg-356rt']),
                     createSiteGroup('siteGroupC', 'siteGroupCDescription', ['abce-sead-azx', '1111-34vsr-11rr12']),
                     createSiteGroup('siteGroupD', 'siteGroupDDescription', ['3g5-mgj-34', '34gs4-4vr-11wwa12']),
                     createSiteGroup('siteGroupE', 'siteGroupEDescription', ['adca-esav-ase', '1111-1asew111-1112']),
                     createSiteGroup('siteGroupF', 'siteGroupFDescription', ['acce-345gs-ndrt7', '345vs-b456b-7dbd']),
				 	 createSiteGroup('siteGroup2', 'siteGroupFDescription2', ['f23-d123d-fde1', 'fdrr-dfd3-j65fg']),
			 		 createSiteGroup('siteGroup10', 'siteGroupFDescription10', ['vrh-yd34-nh323', 'fds1-g356g-dfe1'])];

	let createSiteGroupPromise, updateSiteGroupPromise, getAllPromise;

	var emitSiteGroupStoreChange = () => {
		SiteGroupStore.addChangeListener.mock.calls[0][0]();
	}

	var emitUserStoreChange = () => {
		UserStore.addChangeListener.mock.calls[0][0]();
	}


	var clickAddButton = (wrapper) => {
		wrapper.find('[data-bcn-id="btn-add"]')
			.simulate('click');
	}

	var clickEditButton = (wrapper, index) => {
	 	wrapper.find('[data-bcn-id="btn-edit-siteGroup"]')
			.at(index)
			.simulate('click');
	}

	beforeEach(function () {
		createSiteGroupPromise = deferred();
		updateSiteGroupPromise = deferred();
		getAllPromise = deferred();

		SiteGroupActions.getAll.mockReturnValue(getAllPromise.promise);
		ToastActions.toast.mockClear();
		SiteStore.getInitialized.mockReturnValue(true);
		SiteGroupStore.getInitialized.mockReturnValue(true);
		SiteGroupStore.getSiteGroups.mockReturnValue([]);
		UserStore.getInitialized.mockReturnValue(true);
		UserStore.getUserInfo.mockReturnValue( {
			isAdministrator: function() {
				return true;
			}
		} );
	});


	it('should have an overlay element when shown', function () {

		SiteGroupStore.getInitialized.mockReturnValue(false);

		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		expect(wrapper.find(Overlay)
				.prop('isShown'))
			.toBeTruthy();
	});


	it('should disable add button if sitegroups store not initialized and enable when initialized', function () {
		SiteGroupStore.getInitialized.mockReturnValue(false);

		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		const addButton = wrapper.find('[data-bcn-id="btn-add"]');

		expect(addButton.prop('disabled'))
			.toBeTruthy();

		SiteGroupStore.getInitialized.mockReturnValue(true);
		emitSiteGroupStoreChange();

		expect(addButton.prop('disabled'))
			.toBeFalsy();
	});

	it('should disable add button if user store not initialized and enable when initialized', function () {
		UserStore.getInitialized.mockReturnValue(false);

		const wrapper = mount( < SiteGroups / > );

		emitUserStoreChange();
		emitSiteGroupStoreChange();

		const addButton = wrapper.find('[data-bcn-id="btn-add"]');

		expect(addButton.prop('disabled'))
			.toBeTruthy();

		UserStore.getInitialized.mockReturnValue(true);
		emitUserStoreChange();

		expect(addButton.prop('disabled'))
			.toBeFalsy();
	});

	it('should indicate data being fetched if sitegroups store not initialized and not fetched when initialized', function () {

		SiteGroupStore.addChangeListener.mockReset();
		SiteGroupStore.getInitialized.mockReturnValue(false);
		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		expect(wrapper.find(DataTable)
				.prop('isFetchingNextDataPage'))
			.toBeTruthy();

		SiteGroupStore.getInitialized.mockReturnValue(true);
		emitSiteGroupStoreChange();

		expect(wrapper.find(DataTable)
				.prop('isFetchingNextDataPage'))
			.toBeFalsy();
	});


	it('should display add screen when add button is clicked ', function () {
		const wrapper = mount( < SiteGroups / > );

		expect(wrapper.find(SiteGroupForm))
			.toHaveLength(0);

		emitSiteGroupStoreChange();

		clickAddButton(wrapper);

		expect(wrapper.find(SiteGroupForm))
			.toHaveLength(1);

	});

	it('should disable the edit button for non ADMIN.', function () {
		UserStore.getUserInfo.mockReturnValue( {
			isAdministrator: function() {
				return false;
			}
		} );
		var siteGroups = [testSiteGroups[0], testSiteGroups[1], testSiteGroups[2], testSiteGroups[3]];
		SiteGroupStore.getSiteGroups = jest.fn(() => siteGroups);

		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		const editButtons = wrapper.find('[data-bcn-id="btn-edit-siteGroup"]');

		expect(editButtons.length).toEqual(siteGroups.length);

		editButtons.forEach( function(editButton) {
			expect(editButton.prop('disabled')).toBeTruthy();
		});
	});

	it('should disable the add button for non ADMIN.', function () {
		UserStore.getUserInfo.mockReturnValue( {
			isAdministrator: function() {
				return false;
			}
		} );

		const wrapper = mount( < SiteGroups / > );
		emitSiteGroupStoreChange();

		const addButton = wrapper.find('[data-bcn-id="btn-add"]');
		expect(addButton.prop('disabled'))
			.toBeTruthy();
	});

	it('should display edit screen when edit button is clicked', function () {
		const wrapper = mount( < SiteGroups / > );

		expect(wrapper.find(SiteGroupForm))
			.toHaveLength(0);

		var siteGroups = [testSiteGroups[0], testSiteGroups[1], testSiteGroups[2], testSiteGroups[3]];
		SiteGroupStore.getSiteGroups = jest.fn(() => siteGroups);

		emitSiteGroupStoreChange();

		clickEditButton(wrapper,0);

		expect(wrapper.find(SiteGroupForm))
			.toHaveLength(1);
	});

	// it('should close add screen when _handleSiteGroupForm is invoked with HIDE_FORM action', function () {
	//
	// 	var addIcon = ReactTestUtils.findRenderedDOMComponentWithClass(sut, 'add-button');
	// 	ReactTestUtils.Simulate.click(addIcon);
	//
	// 	var addScreen = element.querySelector('.SiteGroupForm');
	// 	expect(addScreen)
	// 		.not.toBeNull();
	//
	// 	sut._handleSiteGroupForm(['HIDE_FORM']);
	//
	// 	var addScreen = element.querySelector('.SiteGroupForm');
	// 	expect(addScreen)
	// 		.toBeNull();
	// 	expect(sut.state.DisplaySiteGroupForm)
	// 		.toBeFalsy();
	// 	expect(sut.state.currentEditingItem)
	// 		.toBeNull();
	//
	// });
	//
	it('should set proper messageText when list of sitegroups is empty', function () {

		SiteGroupStore.getAll = jest.fn(() => []);

		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		expect(wrapper.find(DataTable)
				.prop('messageText'))
			.toEqual('No site groups found.');

	});

	it('when site group store changes, state of sitegroups component should contain updated sites', function () {

		var siteGroups = [];
		SiteGroupStore.getSiteGroups = jest.fn(() => siteGroups);

		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		expect(wrapper.find(DataTable)
				.prop('data'))
			.toEqual([]);

		siteGroups = [testSiteGroups[0], testSiteGroups[1], testSiteGroups[2], testSiteGroups[3]];
		SiteGroupStore.getSiteGroups = jest.fn(() => siteGroups);

		emitSiteGroupStoreChange();

		expect(wrapper.find(DataTable)
				.prop('data'))
			.toEqual([testSiteGroups[0], testSiteGroups[1], testSiteGroups[2], testSiteGroups[3]]);

	});

	it('should close when Overlay close handler called', function () {

		const wrapper = mount( < SiteGroups / > );

		emitSiteGroupStoreChange();

		const closeHandler = wrapper.find(Overlay)
			.prop('closeHandler');

		closeHandler();

		expect(SiteGroupActions.close)
			.toBeCalled();
	});

	it('should register for Sitegroup and UserStore changes when mounted', function () {
		const wrapper = mount( < SiteGroups / > );

		expect(SiteGroupStore.addChangeListener)
			.toBeCalled();
		expect(UserStore.addChangeListener)
			.toBeCalled();
	});


	it('should return correct metadata given SiteGroup', function () {
		let emptySiteGroup = {};

		const wrapper = mount( < SiteGroups / > );
		emitSiteGroupStoreChange();
		const metadata = wrapper.find(DataTable)
			.prop('metadata');

		expect(metadata[0].value(testSiteGroups[0]))
			.toEqual('siteGroupA');
		expect(metadata[1].value(testSiteGroups[0]))
			.toEqual('siteGroupADescription');
		expect(metadata[2].value(testSiteGroups[0]))
			.toEqual(2);
		expect(metadata[2].value(emptySiteGroup))
			.toEqual(0);
		expect(metadata[3].value(testSiteGroups[0]))
			.toEqual(1);
	});

	it('should perform natural comparison on name', function () {
		const wrapper = mount( < SiteGroups / > );
		emitSiteGroupStoreChange();
		const metadata = wrapper.find(DataTable)
			.prop('metadata');

		expect(metadata[0].sortComparator(testSiteGroups[6], testSiteGroups[7]))
			.toEqual(-1);
		expect(metadata[0].sortComparator(testSiteGroups[7], testSiteGroups[6]))
			.toEqual(1);
	});

	it('should perform natural comparison on description', function () {
		const wrapper = mount( < SiteGroups / > );
		emitSiteGroupStoreChange();
		const metadata = wrapper.find(DataTable)
			.prop('metadata');
		expect(metadata[1].sortComparator(testSiteGroups[6], testSiteGroups[7]))
			.toEqual(-1);
		expect(metadata[1].sortComparator(testSiteGroups[7], testSiteGroups[6]))
			.toEqual(1);
	});

	it('should perform numerical comparison on sites', function () {
		const wrapper = mount( < SiteGroups / > );
		emitSiteGroupStoreChange();
		const metadata = wrapper.find(DataTable)
			.prop('metadata');
		expect(metadata[2].sortComparator(testSiteGroups[1], testSiteGroups[0]))
			.toEqual(-1);
		expect(metadata[2].sortComparator(testSiteGroups[0], testSiteGroups[1]))
			.toEqual(1);
		expect(metadata[2].sortComparator(testSiteGroups[0], testSiteGroups[2]))
			.toEqual(0);
	});

	it('should perform numerical comparison on policies', function () {
		const wrapper = mount( < SiteGroups / > );
		emitSiteGroupStoreChange();
		const metadata = wrapper.find(DataTable)
			.prop('metadata');
		expect(metadata[3].sortComparator(testSiteGroups[1], testSiteGroups[0]))
			.toBeLessThanOrEqual(-1);
		expect(metadata[3].sortComparator(testSiteGroups[0], testSiteGroups[1]))
			.toBeGreaterThanOrEqual(1);
		expect(metadata[3].sortComparator(testSiteGroups[2], testSiteGroups[3]))
			.toEqual(0);
	});
});
