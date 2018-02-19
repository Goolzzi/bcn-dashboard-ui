jest.unmock('../src/scripts/components/Overlay/Overlay.js');
jest.unmock('../src/scripts/components/Overlay/render.jsx');
jest.unmock('../src/scripts/components/DataTable/DataTable');
jest.unmock('../src/scripts/components/DataTable/render.jsx');
jest.unmock('../src/scripts/components/DomainLists/DomainLists');
jest.unmock('../src/scripts/components/DomainLists/render.jsx');
jest.unmock('../src/scripts/components/Spinner/Spinner');
jest.unmock('../src/scripts/components/Spinner/render.jsx');
jest.unmock('stable');

jest.unmock('lodash');
jest.unmock('natural-compare-lite');

describe('Domain List component tests', function () {

	let _ = require('lodash');
	let DomainLists = require('../src/scripts/components/DomainLists/DomainLists')
		.default;
	let DomainListStore = require('../src/scripts/stores/DomainListStore')
		.default;
	let DomainListActions = require('../src/scripts/actions/DomainListActions')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;

	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let naturalCompare = require('natural-compare-lite');
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut, element;

	var createDomainList = (domainListName, domainListDescription, domainCount, policies) => {
		return {
			name: domainListName,
			description: domainListDescription,
			domainCount: domainCount,
			policies: policies
		};
	};

	let testDomainList = [createDomainList('domainListA', 'domainListADescription', 1005000, ['policy', 'policy2']),
                      createDomainList('domainListB', 'domainListBDescription', 999999, ['policy', 'policy2', 'policy3']),
                      createDomainList('domainListC', 'domainListCDescription', 800900, ['policy']),
                      createDomainList('domainListD', 'domainListDDescription', 32460, ['policy']),
                      createDomainList('domainListE', 'domainListEDescription', 999, ['policy']),
                      createDomainList('domainListF', 'domainListFDescription', 9995000, ['policy']),
                      createDomainList('domainList2', 'domainListFDescription2', 450000, ['policy']),
                      createDomainList('domainList10', 'domainListFDescription10', 0, ['policy'])];

	let createDomainListPromise, updateDomainListPromise, getAllPromise;

	beforeEach(function () {

		createDomainListPromise = deferred();
		updateDomainListPromise = deferred();
		getAllPromise = deferred();
		DomainListActions.getAll.mockReturnValue(getAllPromise.promise);

		ToastActions.toast.mockClear();
		DomainListStore.getDomainLists.mockReturnValue([]);

		sut = ReactTestUtils.renderIntoDocument( < DomainLists / > );
		sut._handleChange();

		element = ReactDOM.findDOMNode(sut);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('should have rendered element', function () {
		expect(element)
			.not.toBeNull();
	});

	it('should have an overlay element', function () {
		var overlay = element.querySelector('.Overlay');
		expect(overlay)
			.not.toBeNull();
	});

	it('should set proper messageText when list of domainList is empty', function () {
		var domainlist = null;
		DomainListStore.getAll = jest.fn(() => domainList);
		sut._handleChange();
		expect(sut.state.messageText)
			.toEqual('No domain lists found.');
	});

	it('should close when close button is clicked', function () {
		var closeButtonIcon = element.querySelector('.close-button');
		ReactTestUtils.Simulate.click(closeButtonIcon);

		expect(DomainListActions.close)
			.toBeCalled();
	});

	it('should close when _handleOverlayClose is called', function () {

		sut._handleOverlayClose();
		expect(DomainListActions.close)
			.toBeCalled();
	});

	it('should format the number of domains correctly', function () {
		expect(sut.state.metadata[2].value(testDomainList[0]))
			.toEqual('1Mil');
		expect(sut.state.metadata[2].value(testDomainList[1]))
			.toEqual('1Mil');
		expect(sut.state.metadata[2].value(testDomainList[2]))
			.toEqual('801K');
		expect(sut.state.metadata[2].value(testDomainList[3]))
			.toEqual('32.5K');
		expect(sut.state.metadata[2].value(testDomainList[4]))
			.toEqual('999');
		expect(sut.state.metadata[2].value(testDomainList[5]))
			.toEqual('10Mil');
		expect(sut.state.metadata[2].value(testDomainList[6]))
			.toEqual('450K');
		expect(sut.state.metadata[2].value(testDomainList[7]))
			.toEqual('0');
	});

	it('should add a change listener after component is mounted', function () {
		sut.componentDidMount();
		expect(DomainListStore.addChangeListener)
			.toBeCalled();
	});

	it('should return correct metadata given SiteGroup', function () {
		let emptySiteGroup = {};
		expect(sut.state.metadata[0].value(testDomainList[0]))
			.toEqual('domainListA');
		expect(sut.state.metadata[1].value(testDomainList[0]))
			.toEqual('domainListADescription');
		expect(sut.state.metadata[2].value(testDomainList[0]))
			.toEqual('1Mil');
		expect(sut.state.metadata[3].value(testDomainList[0]))
			.toEqual(2);
	});
	//
	it('should get the correct edit button', function () {
		let editButton = sut.state.metadata[4].value(testDomainList[0]);
		expect(editButton.type)
			.toEqual('button');
		expect(editButton.props.className)
			.toContain('btn-edit-image');
	});

	it('should perform natural comparison on name', function () {
		expect(sut.state.metadata[0].sortComparator(testDomainList[6], testDomainList[7]))
			.toEqual(-1);
		expect(sut.state.metadata[0].sortComparator(testDomainList[7], testDomainList[6]))
			.toEqual(1);
		expect(sut.state.metadata[0].sortComparator(testDomainList[7], testDomainList[7]))
			.toEqual(0);
	});

	it('should perform natural comparison on description', function () {
		expect(sut.state.metadata[1].sortComparator(testDomainList[6], testDomainList[7]))
			.toEqual(-1);
		expect(sut.state.metadata[1].sortComparator(testDomainList[7], testDomainList[6]))
			.toEqual(1);
		expect(sut.state.metadata[1].sortComparator(testDomainList[7], testDomainList[7]))
			.toEqual(0);
	});

	it('should perform numerical comparison on domains', function () {
		expect(sut.state.metadata[2].sortComparator(testDomainList[0], testDomainList[1]))
			.toBeGreaterThanOrEqual(1);
		expect(sut.state.metadata[2].sortComparator(testDomainList[1], testDomainList[0]))
			.toBeLessThanOrEqual(-1);
		expect(sut.state.metadata[2].sortComparator(testDomainList[0], testDomainList[0]))
			.toEqual(0);
	});

	it('should perform numerical comparison on policies', function () {
		expect(sut.state.metadata[3].sortComparator(testDomainList[1], testDomainList[0]))
			.toBeGreaterThanOrEqual(1);
		expect(sut.state.metadata[3].sortComparator(testDomainList[0], testDomainList[1]))
			.toBeLessThanOrEqual(-1);
		expect(sut.state.metadata[3].sortComparator(testDomainList[3], testDomainList[3]))
			.toEqual(0);
	});
});
