import React from 'react';
import moment from 'moment';
import render from './render.jsx';

import AppConstants from '../../../../../../constants/AppConstants';

import FilterStore from '../../../../../../stores/FilterStore';
import DnsQueryLogStore from '../../../../../../stores/DnsQueryLogStore';

import ToastActions from '../../../../../../actions/ToastActions';
import DnsQueryLogActions from '../../../../../../actions/DnsQueryLogActions';

import LogManager from '../../../../../../logger/logger'

const LOGGER = LogManager.getLogger('DataView');

var Metadata = [
	{
		header: 'Time',
		value: function (item) {
			var time = new moment(item.time);
			return time.format('YYYY/MM/DD HH:mm:ss');
		},
		width: '10%'
    },
	{
		header: 'Source',
		value: function (item) {
			return item.source;
		},
		width: '10%'
    },
	{
		header: 'Site',
		value: function (item) {
			return item.site;
		},
		width: '15%'
    },
	{
		header: 'Query Name',
		value: function (item) {
			return item.query;
		},
		width: '35%'
    },
	{
		header: 'Query Type',
		value: function (item) {
			return item.queryType;
		},
		width: '10%'
    },
	{
		header: 'Response',
		value: function (item) {
			return item.response;
		},
		width: '10%'
    },
	{
		header: 'Policy Action',
		value: function (item) {
			let action = item.actionTaken;
			if (action === 'query-response') {
				return 'None';
			}

			action = action.toLowerCase();
			return action.charAt(0)
				.toUpperCase() + action.slice(1);
		},
		width: '10%',
		color: function (item) {
			let action = item.actionTaken.toLowerCase();
			if (action === 'monitor') {
				return '#808080';
			} else if (action === 'blacklist' || action === 'block') {
				return '#FF512D';
			}
		}
    }
];

/**
 * DataView Component
 */
var DataView = React.createClass({
	isPendingToastCall: false,
	isPendingToastCallTimer: null,

	/** Get initial state */
	getInitialState: function () {
		return {
			dnsActivityTableContent: this._createDnsActvityTableContent({}),
			metadata: Metadata,
			activeTab: 'dns-activity',
			tabItems: [
				{
					id: 'dns-activity',
					title: 'DNS Activity',
					getContentCallback: this._getDnsActivityDataTable
                }
            ],
			isFetchingNextDataPage: false
		};
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		FilterStore.addChangeListener(this._handleFilterChange);
		DnsQueryLogStore.addChangeListener(this._handleDnsQueryLogChange);
		this._initializeDnsActivityTableContent();
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		FilterStore.removeChangeListener(this._handleFilterChange);
		DnsQueryLogStore.removeChangeListener(this._handleDnsQueryLogChange);
		this._reset();
	},

	_createDnsActvityTableContent: function (content) {
		return Object.assign({
				messageText: null,
				data: [],
				numDataAdded: 0,
				isFetchingNextDataPage: false,
				isFetchingPrevDataPage: false,
				requestPrevDataPage: this._requestPrevPageDnsActivity,
				requestNextDataPage: this._requestNextPageDnsActivity
			},
			content);
	},

	_modifyDnsActvityTableContent: function (content) {
		return Object.assign(this.state.dnsActivityTableContent, content);
	},

	_reset: function () {
		this._stopRefreshing();
		DnsQueryLogActions.cancelAllActiveRequests();
		this.isPendingToastCall = false;
	},

	_initializeDnsActivityTableContent: function () {

		this._reset();

		var filters = FilterStore.getFilters();
		if (filters == null) {
			this.setState({
				dnsActivityTableContent: this._createDnsActvityTableContent({
					messageText: 'Enter a filter command to view data.'
				})
			});
			return;
		}
		this.setState({
			dnsActivityTableContent: this._createDnsActvityTableContent({
				isFetchingNextDataPage: true
			})
		});

		//this call will make the store refresh itself, which will eventually make the table do same
		//Q may want to move to datatable, so record count it based on size of table.
		DnsQueryLogActions.getInitialDnsQueryLogs(AppConstants.QUERYLOGS_MAX_BUFFER)
			.then(() => {
				ToastActions.removeAll();
				this._startRefreshing();
			})
			.catch((error) => {
				this.setState({
					dnsActivityTableContent: this._createDnsActvityTableContent({
						isFetchingNextDataPage: false
					})
				});
				this._handleError();
			});

	},

	_requestPrevPageDnsActivity: function () {
		LOGGER.logDebug('_requestPrevPageDnsActivity');
		if (DnsQueryLogStore.getIsMoreNewLogsAvailable() === false) {
			LOGGER.logDebug('no more new logs available');
			return false;
		}

		this.setState({
			dnsActivityTableContent: this._modifyDnsActvityTableContent({
				isFetchingPrevDataPage: true
			})
		});

		//this call will make the store refresh itself, which will eventually make the table do same
		//Q may want to move to datatable, so record count it based on size of table.
		DnsQueryLogActions.getNewDnsQueryLogs(DnsQueryLogStore.getStartKey(), AppConstants.QUERYLOGS_PAGE_SIZE)
			.catch(() => {
				this.setState({
					dnsActivityTableContent: this._modifyDnsActvityTableContent({
						isFetchingPrevDataPage: false
					})
				});
				this._handleError();
			});
		return true;
	},

	_handleError: function () {
		this._reset();
		ToastActions.toast('application-error', 'Something went wrong. Please refresh your browser or contact your administrator if the issue persists.');
	},

	_requestNextPageDnsActivity: function () {
		LOGGER.logDebug('_requestNextPageDnsActivity');
		if (DnsQueryLogStore.getIsMoreOldLogsAvailable() === false) {
			LOGGER.logDebug('no more old logs available');
			return false;
		}

		this.setState({
			dnsActivityTableContent: this._modifyDnsActvityTableContent({
				isFetchingNextDataPage: true
			})
		});

		//this call will make the store refresh itself, which will eventually make the table do same
		//Q may want to move to datatable, so record count it based on size of table.
		DnsQueryLogActions.getOldDnsQueryLogs(DnsQueryLogStore.getEndKey(), AppConstants.QUERYLOGS_PAGE_SIZE)
			.catch(() => {
				this.setState({
					dnsActivityTableContent: this._modifyDnsActvityTableContent({
						isFetchingNextDataPage: false
					})
				});
				this._handleError();
			});
		return true;
	},

	_startRefreshing: function () {
		this.isPendingToastCallTimer = setInterval(function () {
			if (!this.isPendingToastCall) {
				this.isPendingToastCall = true;
				DnsQueryLogActions.isNewDataAvailable(DnsQueryLogStore.getInitialKey())
					.then(() => {
						if (DnsQueryLogStore.isNewDataAvailable()) {
							clearInterval(this.isPendingToastCallTimer);
							ToastActions.toast('dnsquerylog-new', 'There are new rows of DNS data. Click here to refresh.', function () {
								this._initializeDnsActivityTableContent();
							}.bind(this));
						}
						this.isPendingToastCall = false;
					})
					.catch(() => {
						this._handleError();
					});
			}
		}.bind(this), 5000);
	},

	_stopRefreshing: function () {
		if (this.isPendingToastCallTimer) {
			clearInterval(this.isPendingToastCallTimer);
			this.isPendingToastCallTimer = null;
		}
	},

	/**
	 * Get DataTable component
	 * @returns {ReactComponent}
	 */
	_getDnsActivityDataTable: function () {
		return render.DataTable.call(this, 'dnsquerylog', this.state.dnsActivityTableContent);
	},

	/** When query log changes, update state */
	_handleDnsQueryLogChange: function () {
		LOGGER.logInfo('_handleDnsQueryLogChange');
		var queryLogs = DnsQueryLogStore.getQueryLogs();
		var numQueryLogsAdded = DnsQueryLogStore.getNumQueryLogsAdded();
		if (queryLogs.length > 0) {
			this.setState({
				dnsActivityTableContent: this._createDnsActvityTableContent({
					data: queryLogs,
					numDataAdded: numQueryLogsAdded
				})
			});
		} else {
			this.setState({
				dnsActivityTableContent: this._createDnsActvityTableContent({
					messageText: 'This site does not have any data.'
				})
			});
		}
	},

	_handleFilterChange: function () {
		LOGGER.logInfo('_handleFilterChange');
		this._initializeDnsActivityTableContent();
	},


	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.DataView.call(this);
	}
});

export default DataView;
