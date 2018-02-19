jest.unmock('../src/scripts/components/DataTable/DataTable');
jest.unmock('../src/scripts/components/DataTable/render.jsx');
jest.unmock('../src/scripts/components/Spinner/Spinner');
jest.unmock('../src/scripts/components/Spinner/render.jsx');
jest.unmock('lodash');
jest.unmock('stable')
jest.unmock('natural-compare-lite')

import {
	mount
} from 'enzyme';

describe('DataTable component tests', function () {
	let DataTable = require('../src/scripts/components/DataTable')
		.default;
	let Spinner = require('../src/scripts/components/Spinner')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let _ = require('lodash');
	let naturalCompare = require('natural-compare-lite');


	var metadata = [
		{
			id: 'time',
			sortComparator: function (a, b) {
				return this.value(a) - this.value(b);
			},
			value: function (item) {
				return item.time;
			},
			sortable: true,
			header: 'TIME',
			width: '10px'
		},
		{
			id: 'source',
			sortComparator: function (a, b) {
				return naturalCompare(a.source.toLowerCase(), b.source.toLowerCase());
			},
			value: function (item) {
				return item.source;
			},
			sortable: true,
			header: 'SOURCE',
			width: '10px'
		},
		{
			id: 'site',
			value: function (item) {
				return item.site;
			},
			sortComparator: function (a, b) {
				return naturalCompare(a.site.toLowerCase(), b.site.toLowerCase());
			},
			sortable: true,
			header: 'SITE',
			width: '10px'
		},
		{
			id: 'nosort',
			value: function (item) {
				return item.site;
			},
			sortable: false,
			header: 'NoSortSite',
			width: '10px'
		}];

	var tableId = '1';

	var createDataItem = function (time, source, site) {
		return {
			'time': time,
			'source': source,
			'site': site
		}
	}

	let testData = [createDataItem(2, 'a1', 'site4'),
			createDataItem(1, 'a10', 'site3'),
			createDataItem(1, 'b10', 'site5'),
			createDataItem(4, 'a1', 'site2'),
			createDataItem(3, 'A1', 'site1')];

	var loadNextDataPage = jest.fn(() => true);
	var loadPrevDataPage = jest.fn(() => true);
	var sortData = jest.fn(() => true);

	var verifyDataTable = function (expectedData) {
		for (var r = 0; r < testData.length; r++) {
			expect(getTableElement(r, 0)
					.innerHTML)
				.toBe(expectedData[r].time.toString());
			expect(getTableElement(r, 1)
					.innerHTML)
				.toBe(expectedData[r].source);
			expect(getTableElement(r, 2)
					.innerHTML)
				.toBe(expectedData[r].site);
			expect(getTableElement(r, 3)
					.innerHTML)
				.toBe(expectedData[r].site);
		}
	}

	var sut, sutDOMNode;
	var loadNextDataPage, loadPrevDataPage, sortData;

	beforeEach(function () {
		loadNextDataPage = jest.fn(() => true);
		loadPrevDataPage = jest.fn(() => true);
		sortData = jest.fn(() => true);

		sut = ReactTestUtils.renderIntoDocument(React.createElement(DataTable, {
			tableId: tableId,
			metadata: metadata,
			messageText: null,
			data: testData,
			defaultSort: {
				headerId: 'time',
				sort: 'asc'
			},
			numDataAdded: 4,
			moreNextDataAvailable: null,
			requestNextDataPage: loadNextDataPage,
			requestPrevDataPage: loadPrevDataPage,
			isFetchingNextDataPage: false,
			isFetchingPrevDataPage: false
		}));
		sutDOMNode = ReactDOM.findDOMNode(sut);
	});

	var getTableHeaders = () => {
		return sutDOMNode.querySelectorAll('.DataTable .table-header thead th');
	};

	var getTableRows = () => {
		return sutDOMNode.querySelectorAll('div[class~="table-body"] tr');
	};

	var getTableElement = (row, col) => {
		return getTableRows()[row].querySelectorAll('td')[col];
	};

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('when we are on the datatable page, the datatable should be present"', function () {
		expect(sutDOMNode.getAttribute('class'))
			.toEqual('DataTable');
	});

	it('when a datatable with data is present, then it should have rows', function () {
		expect(sutDOMNode.querySelectorAll('tbody tr')
				.length)
			.toEqual(testData.length);
	});

	it('when a datatable with data is present, then it should have columns', function () {
		expect(sutDOMNode.querySelectorAll('thead th')
				.length)
			.toEqual(metadata.length);
	});

	it('should sort using provided defaultSort values when initially rendered', function () {
		let expectedSortedData = _.orderBy(testData, [item => metadata[0].value(item)], 'asc');
		verifyDataTable(expectedSortedData);
	});

	it('should toggle existing sort when sorted header clicked', function () {
		let expectedSortedData = _.orderBy(testData, [item => metadata[0].value(item)], 'asc');
		verifyDataTable(expectedSortedData);
		expectedSortedData = _.orderBy(testData, [item => metadata[0].value(item)], 'desc');
		ReactTestUtils.Simulate.click(getTableHeaders()[0]);
		verifyDataTable(expectedSortedData);
		expectedSortedData = _.orderBy(testData, [item => metadata[0].value(item)], 'asc');
		ReactTestUtils.Simulate.click(getTableHeaders()[0]);
		verifyDataTable(expectedSortedData);
	});

	it('should sort asc when sorting by new column', function () {
		let expectedSortedData = _.orderBy(testData, [item => metadata[2].value(item)], 'asc');
		console.log(expectedSortedData);
		ReactTestUtils.Simulate.click(getTableHeaders()[2]);
		console.log(expectedSortedData);
		verifyDataTable(expectedSortedData);
	});

	it('should use provided sortComparator for sorting, and use default sort item as secondary sort if provided', function () {
		let expectedSortedData = _.cloneDeep(testData);
		expectedSortedData.sort(function (a, b) {
			var sortValue = naturalCompare(a.source.toLowerCase(), b.source.toLowerCase());
			if (sortValue == 0) {
				sortValue = a.time - b.time;
			}
			return sortValue;
		});
		console.log(expectedSortedData);
		ReactTestUtils.Simulate.click(getTableHeaders()[1]);
		console.log(expectedSortedData);
		verifyDataTable(expectedSortedData);

		expectedSortedData.sort(function (a, b) {
			return naturalCompare(a.source.toLowerCase(), b.source.toLowerCase()) * -1;
		});
		ReactTestUtils.Simulate.click(getTableHeaders()[1]);
		verifyDataTable(expectedSortedData);
	});

	it('should sort in stable fashion', function () {

		var expectedSortFunction = function (orderModifier, a, b) {
			var sortValue = naturalCompare(a.source.toLowerCase(), b.source.toLowerCase()) * orderModifier;
			if (sortValue == 0) {
				sortValue = a.time - b.time;
			}
			return sortValue;
		};

		let expectedSortedData = _.cloneDeep(testData);
		expectedSortedData.sort(expectedSortFunction.bind(null, 1));
		console.log(expectedSortedData);
		ReactTestUtils.Simulate.click(getTableHeaders()[1]);
		console.log(expectedSortedData);
		verifyDataTable(expectedSortedData);
		expectedSortedData.sort(expectedSortFunction.bind(null, -1));
		ReactTestUtils.Simulate.click(getTableHeaders()[1]);
		verifyDataTable(expectedSortedData);
	});

	it('should not sort table using columns marked as unsortable', function () {
		let expectedSortedData = _.orderBy(testData, [item => metadata[0].value(item)], 'asc');
		console.log(expectedSortedData);
		ReactTestUtils.Simulate.click(getTableHeaders()[3]);
		console.log(expectedSortedData);
		verifyDataTable(expectedSortedData);
	});


	it('should display messageText when rendered if provided', function () {
		var testText = 'My text, my text, my text, talking bout my text, my text.';
		var sut = ReactTestUtils.renderIntoDocument(React.createElement(DataTable, {
			tableId: tableId,
			metadata: metadata,
			data: [],
			numDataAdded: 0,
			requestNextDataPage: function () {},
			requestPrevDataPage: function () {},
			isFetchingNextDataPage: false,
			isFetchingPrevDataPage: false,
			messageText: testText
		}));

		var elementNode = ReactDOM.findDOMNode(sut);
		var messageNode = elementNode.querySelector('*[data-bcn-id="table-message"]');
		expect(messageNode.innerHTML)
			.toEqual(testText);
		expect(messageNode.style.display)
			.toEqual('inline');
	});

	// it('when making rows and refreshing, spinner element should be created', function() {
	//    React.createElement = jest.genMockFunction('tr').mockReturnValue([]);
	//    sut.state.isRefreshing = true;
	//    sut._makeRows();
	//    expect(React.createElement).toBeCalled();
	// });

	it('when scroll bar at the botton new log data should be requested via requestNextDataPage', function () {
		var eventMock = {
			target: {
				clientHeight: 100,
				scrollHeight: 1000,
				offsetHeight: 100,
				scrollTop: 900
			}
		};

		sut._handleScroll(eventMock);

		expect(loadNextDataPage)
			.toBeCalled();
		expect(sut.isLoadingNextData)
			.toEqual(true);
	});

	it('when scroll bar at the botton new log data should be requested via requestNextDataPage', function () {
		var eventMock = {
			target: {
				clientHeight: 100,
				scrollHeight: 1000,
				offsetHeight: 100,
				scrollTop: 0
			}
		};

		sut._handleScroll(eventMock);

		expect(loadPrevDataPage)
			.toBeCalled();
		expect(sut.isLoadingPrevData)
			.toEqual(true);
	});


	it('should render with no sorting when no default sort defined', function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);

		sut = ReactTestUtils.renderIntoDocument(React.createElement(DataTable, {
			tableId: tableId,
			metadata: metadata,
			data: testData,
			numDataAdded: 0,
			requestNextDataPage: function () {},
			requestPrevDataPage: function () {},
			isFetchingNextDataPage: false,
			isFetchingPrevDataPage: false
		}));

		sutDOMNode = ReactDOM.findDOMNode(sut);
		verifyDataTable(testData);
	});

	it('should render loading spinner when loading initial data', function () {

			const wrapper = mount( < DataTable tableId = {tableId}
				metadata = {metadata }
				data = {[]}
				numDataAdded = { 0 }
				requestNextDataPage = { () => {} }
				requestPrevDataPage = { () => {} }
				isFetchingNextDataPage = { true }
				isFetchingPrevDataPage = { false } /> );

				expect(wrapper.find(Spinner)
					.last()
					.prop('id'))
				.toEqual('spinner-datatable-next'); expect(wrapper.find(Spinner)
					.last()
					.prop('show'))
				.toBeTruthy();
	});
});
