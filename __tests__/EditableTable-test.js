jest.dontMock('../src/scripts/components/EditableTable/EditableTable');
jest.dontMock('../src/scripts/components/EditableTable/render.jsx');

describe('EditableTable component tests', function () {
	let EditableTable = require('../src/scripts/components/EditableTable')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');

	var data = [];
	var sitesTableMetadata = [
		{
			header: 'Name',
			value: function (item) {
				return item.siteName;
			},
			isDefault: function (item) {
				return false;
			},
			width: '30%',
			isDisabled: false
        },
		{
			header: 'Location',
			value: function (item) {
				return item.location;
			},
			isDefault: function (item) {
				return false;
			},
			width: '30%',
			isDisabled: false
        },
		{
			header: 'Forwarding DNS',
			value: function (item) {
				return '8.8.8.8';
			},
			isDefault: function (item) {
				return false;
			},
			width: '20%',
			isDisabled: true
        },
		{
			header: 'Action',
			value: function (item) {
				return '';
			},
			isDefault: function (item) {
				return false;
			},
			width: '20%',
			isDisabled: false,
			isActionsField: true
        }
    ];

	var tableId = '1';

	const NUMBER_OF_INPUT_TEXTFIELDS = 3;

	var lastIndex = 0;
	var createRows = function (num) {
		var rows = [];
		var limit = lastIndex + num;
		for (; lastIndex < limit; lastIndex++) {
			rows.push({
				id: lastIndex,
				name: 'Row ' + lastIndex
			});
		}
		return rows;
	};

	data = createRows(3);

	var validateNewSite = jest.fn();

	var sut, element;

	beforeEach(function () {
		sut = ReactTestUtils.renderIntoDocument(React.createElement(EditableTable, {
			tableId: tableId,
			metadata: sitesTableMetadata,
			messageText: null,
			data: data,
			validateData: validateNewSite,
			newData: {},
			handleOnChange: jest.fn(),
			handleOnClear: jest.fn(),
			isSubmitting: false,
			isFetchingData: false
		}));
		element = ReactDOM.findDOMNode(sut);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('when we are on the editabletable page, the table should be present"', function () {
		expect(element.getAttribute('class'))
			.toEqual('EditableTable');

	});

	it('when a editabletable with data is present, then it should have rows', function () {
		expect(element.querySelectorAll('div.table-body tbody tr')
				.length)
			.toEqual(data.length);
	});

	it('when a editabletable with data is present, then it should have columns', function () {
		expect(element.querySelectorAll('thead th')
				.length)
			.toEqual(sitesTableMetadata.length);
	});

	it('when a editabletable with data is present, then it should have an add site row', function () {
		expect(element.querySelectorAll('table.table-addItem tbody tr td')
				.length)
			.toEqual(sitesTableMetadata.length);
	});

	it('when a editabletable with data is present, and the add sites row is present, then all the fields should be input fields except for the action field', function () {
		expect(element.querySelectorAll('table.table-addItem tbody tr td input')
				.length)
			.toEqual(NUMBER_OF_INPUT_TEXTFIELDS);
	});

	it('should display messageText when rendered if provided', function () {
		var testText = 'My text, my text, my text, talking bout my text, my text.';
		var sut = ReactTestUtils.renderIntoDocument(React.createElement(EditableTable, {
			tableId: tableId,
			metadata: sitesTableMetadata,
			data: [],
			validateData: validateNewSite,
			newData: {},
			handleOnChange: jest.fn(),
			handleOnClear: jest.fn(),
			isSubmitting: false,
			messageText: testText,
			isFetchingData: false
		}));

		var elementNode = ReactDOM.findDOMNode(sut);
		var messageNode = elementNode.querySelector('*[data-bcn-id="validation-error-message"]');
		expect(messageNode.innerHTML)
			.toEqual(testText);
	});

	it('should call validateData when submit button is pressed', function () {

		var eventMock = {
			preventDefault: jest.fn()
		};

		sut._handleSubmit(eventMock);
		expect(eventMock.preventDefault)
			.toBeCalled();
		expect(validateNewSite)
			.toBeCalled();
	});

	it('should update state when input is changed', function () {
		var eventMock = {
			target: {
				value: 'Toronto'
			}
		};

		sut._handleOnChange('name', eventMock);
		expect(sut.props.handleOnChange)
			.toBeCalled();
	});
});
