jest.dontMock('moment')
jest.dontMock('../src/scripts/router/routes/App/routes/Data/components/DataView');
jest.dontMock('../src/scripts/router/routes/App/routes/Data/components/render.jsx');
jest.dontMock('../src/scripts/constants/AppConstants');

describe('Data component tests', function () {

	let DataView = require('../src/scripts/router/routes/App/routes/Data/components/DataView')
		.default;
	let DnsQueryLogStore = require('../src/scripts/stores/DnsQueryLogStore')
		.default;
	let DnsQueryLogActions = require('../src/scripts/actions/DnsQueryLogActions')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let FilterStore = require('../src/scripts/stores/FilterStore')
		.default;
	let AppConstants = require('../src/scripts/constants/AppConstants')
		.default;
	let moment = require('moment');
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');

	const deferred = require('../__testutils__/deferred.js')
		.default;

	var sut, element, promises;

	var expectedText = 'There is new data.';
	var expectedType = 'application-error';

	beforeEach(function () {
		promises = {
			getInitialLogsPromise: deferred(),
			getIsNewDataAvailablePromise: deferred(),
			getOldLogsPromise: deferred(),
			getNewLogsPromise: deferred()
		};

		DnsQueryLogActions.getInitialDnsQueryLogs.mockReturnValue(promises.getInitialLogsPromise.promise);
		DnsQueryLogActions.getOldDnsQueryLogs.mockReturnValue(promises.getOldLogsPromise.promise);
		DnsQueryLogActions.getNewDnsQueryLogs.mockReturnValue(promises.getNewLogsPromise.promise);
		DnsQueryLogActions.isNewDataAvailable.mockReturnValue(promises.getIsNewDataAvailablePromise.promise);

		DnsQueryLogStore.isNewDataAvailable.mockReturnValue(true);
		DnsQueryLogStore.getQueryLogs.mockReturnValue([]);

		sut = ReactTestUtils.renderIntoDocument( < DataView / > );
		element = ReactDOM.findDOMNode(sut);

	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('metadata table should have data under the correct headers', function () {
		var item = {
			'time': 1461860396000,
			'source': '192.168.100.101',
			'site': 'BlueCat Toronto',
			'query': 'www.facebook.com',
			'queryType': 'AAAA',
			'actionTaken': 'query-response',
			'response': 'NOERROR',
			'recordId': '1'
		};

		var v = sut.state.metadata;
		var time = new moment(1461860396000);
		expect(v[0].value(item))
			.toEqual(time.format('YYYY/MM/DD HH:mm:ss'));
		expect(v[1].value(item))
			.toEqual('192.168.100.101');
		expect(v[2].value(item))
			.toEqual('BlueCat Toronto');
		expect(v[3].value(item))
			.toEqual('www.facebook.com');
		expect(v[4].value(item))
			.toEqual('AAAA');
		expect(v[5].value(item))
			.toEqual('NOERROR');
		expect(v[6].value(item))
			.toEqual('None');
	});

	it('non query-response actions should start with Uppercase', function () {
		var item = {
			'actionTaken': 'monitor'
		};

		var v = sut.state.metadata;
		expect(v[6].value(item))
			.toEqual('Monitor');
	});

	it('non query-response actions should have special color', function () {
		var item = {
			'actionTaken': 'monitor'
		};

		var v = sut.state.metadata;
		expect(v[6].color(item))
			.toEqual('#808080');
	});

	it('query-response action should have undefined color', function () {
		var item = {
			'actionTaken': 'query-response'
		};

		var v = sut.state.metadata;
		expect(v[6].color(item))
			.toBeUndefined();
	});

	it('should set proper messageText for the DnsActivityLog table content when rendered with no filter', function () {
		expect(sut.state.dnsActivityTableContent.messageText)
			.toEqual('Enter a filter command to view data.');
	});

	it('should set proper messageText for the DnsActivityLog table content when query returns emtpy set', function () {
		sut._handleDnsQueryLogChange();
		expect(sut.state.dnsActivityTableContent.messageText)
			.toEqual('This site does not have any data.');
	});

	it('should set state.data when query returns non emtpy set', function () {
		var logdata = [{
			site: 'blah',
			recordId: 12345
		}];
		DnsQueryLogStore.getQueryLogs = jest.genMockFunction()
			.mockReturnValue(logdata);
		sut._handleDnsQueryLogChange();
		expect(sut.state.dnsActivityTableContent.messageText)
			.toEqual(null);
		expect(sut.state.dnsActivityTableContent.data)
			.toEqual(logdata);
	});

	it('When loading more queries, service call to fetch queries should be called', function () {
		sut._handleDnsQueryLogChange();
		expect(DnsQueryLogStore.getQueryLogs)
			.toBeCalled();
	});

	it('should process _handleFilterChange event and get initial DNS activity logs', function () {

		FilterStore.getFilters = jest.genMockFunction()
			.mockReturnValue({
				siteName: 'aaa'
			});
		var logdata = [{
			site: 'blah',
			recordId: 12345
		}];

		sut._handleFilterChange();
		expect(FilterStore.getFilters)
			.toBeCalled();
		expect(DnsQueryLogActions.getInitialDnsQueryLogs)
			.toBeCalledWith(AppConstants.QUERYLOGS_MAX_BUFFER);
		expect(sut.state.dnsActivityTableContent.messageText)
			.toEqual(null);
	});

	it('should process _requestNextPageDnsActivity event and get old DNS activity logs', function () {
		DnsQueryLogStore.getIsMoreOldLogsAvailable.mockReturnValue(true);
		DnsQueryLogStore.getEndKey.mockReturnValue(12345);

		sut._requestNextPageDnsActivity();
		expect(DnsQueryLogStore.getIsMoreOldLogsAvailable)
			.toBeCalled();
		expect(DnsQueryLogActions.getOldDnsQueryLogs)
			.toBeCalledWith(12345, AppConstants.QUERYLOGS_PAGE_SIZE);

		// mockPromise.doneCallback();
		// expect(ToastActions.removeAll).toBeCalled();
		// expect(sut.state.dnsActivityTableContent.isFetchingNextDataPage).toEqual(true);

		return promises.getOldLogsPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
			expect(sut.state.dnsActivityTableContent.isFetchingNextDataPage)
				.toEqual(false);

			//no more data case
			DnsQueryLogStore.getIsMoreOldLogsAvailable.mockReturnValue(false);
			expect(sut._requestNextPageDnsActivity())
				.toEqual(false);
		});
	});

	it('should process _requestPrevPageDnsActivity event and get new DNS activity logs', function () {
		DnsQueryLogStore.getIsMoreNewLogsAvailable.mockReturnValue(true);
		DnsQueryLogStore.getStartKey.mockReturnValue(12345);

		sut._requestPrevPageDnsActivity();
		expect(DnsQueryLogStore.getIsMoreNewLogsAvailable)
			.toBeCalled();
		expect(DnsQueryLogActions.getNewDnsQueryLogs)
			.toBeCalledWith(12345, AppConstants.QUERYLOGS_PAGE_SIZE);

		// mockPromise.doneCallback();
		// expect(ToastActions.removeAll).toBeCalled();
		// expect(sut.state.dnsActivityTableContent.isFetchingPrevDataPage).toEqual(true);

		return promises.getNewLogsPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
			expect(sut.state.dnsActivityTableContent.isFetchingPrevDataPage)
				.toEqual(false);

			//no more data case
			DnsQueryLogStore.getIsMoreNewLogsAvailable.mockReturnValue(false);
			expect(sut._requestPrevPageDnsActivity())
				.toEqual(false);
		});
	});

	it("when initial load is complete, polling for new data begins", function () {
		FilterStore.getFilters = jest.genMockFunction()
			.mockReturnValue('filters');
		ToastActions.removeAll = jest.genMockFunction();
		sut._initializeDnsActivityTableContent();
		expect(DnsQueryLogActions.getInitialDnsQueryLogs)
			.toBeCalled();

		return promises.getInitialLogsPromise.resolveThen('something???', () => {
			expect(ToastActions.removeAll)
				.toBeCalled();
			//expect(sut.startRefreshing).toBeCalled();

			//mockPromise.failCallback();
			//  expect(sut._createDnsActvityTableContent).toBeCalled();
			//  expect(sut._displayToastError).toBeCalled();
		});
	});

	it("new data requet fails comes in, toast error message is shown", function () {
		sut._startRefreshing();
		jest.runOnlyPendingTimers();
		return promises.getIsNewDataAvailablePromise.rejectThen('fake error', () => {

			expect(ToastActions.toast)
				.toBeCalledWith('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
		});
	});

	it("new data comes in, toast message is shown", function () {
		sut._startRefreshing();
		jest.runOnlyPendingTimers();
		return promises.getIsNewDataAvailablePromise.resolveThen('some result', () => {
			expect(DnsQueryLogStore.isNewDataAvailable)
				.toBeCalled();
			expect(ToastActions.toast)
				.toBeCalledWith('dnsquerylog-new', 'There are new rows of DNS data. Click here to refresh.', expect.any(Function) );
		});
	});

	it("should unregister the timer when the component is unmounted", function () {
		sut._startRefreshing();
		expect(setInterval)
			.toBeCalled();
		sut.componentWillUnmount();
		expect(clearInterval)
			.toBeCalled();
	});

	it("should unregister the timer when the table is re-initialized", function () {
		sut._startRefreshing();
		expect(setInterval)
			.toBeCalled();
		sut._initializeDnsActivityTableContent();
		expect(clearInterval)
			.toBeCalled();
	});

});
