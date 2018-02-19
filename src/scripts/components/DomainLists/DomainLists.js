/**
 * Domain Lists Component
 */
import render from './render.jsx';
import React from 'react'; // eslint-disable-line no-unused-vars

import DomainListActions from '../../actions/DomainListActions';
import DomainListStore from '../../stores/DomainListStore';
import naturalCompare from 'natural-compare-lite';

const ACTIVE_STATUS_TEXT = 'active';
const INACTIVE_STATUS_TEXT = 'inactive';

import LogManager from '../../logger/logger';

const LOGGER = LogManager.getLogger('DomainLists');


/**
 * Domain Lists Component
 */
var DomainLists = React.createClass({
	/** Get initial state */
	getInitialState: function () {
		return {
			messageText: null,
			numDataAdded: 0,
			dataTable: null,
			domainLists: [],
			zIndexClass: '1',
			isInitialized: false,
			currentEditingItem: null,
			metadata: [
				{
					id: 'name',
					sortComparator: function (a, b) {
						return naturalCompare(a.name.toLowerCase(), b.name.toLowerCase());
					},
					value: function (item) {
						return item.name;
					},
					sortable: true,
					header: 'Name',
					width: '25%'
				},
				{
					id: 'description',
					sortComparator: function (a, b) {
						return naturalCompare(a.description.toLowerCase(), b.description.toLowerCase());
					},
					value: function (item) {
						return item.description;
					},
					sortable: true,
					header: 'Description',
					width: '43%',
					hoverValue: true
                },
				{

					id: 'domains',
					sortComparator: function (a, b) {
						return a.domainCount - b.domainCount;
					},
					value: function (item) {
						let numberFamilySuffixes = ["", "K", "Mil"];
						let formattedNum = '';
						let domainCount;

						domainCount = item.domainCount;
						formattedNum = domainCount + '';
						if (domainCount >= 1000) {
							domainCount = Number(parseFloat(domainCount)
								.toPrecision(3));
							var numberFamily = Math.floor((("" + domainCount)
								.length - 1) / 3);
							var numericValue = ((domainCount / Math.pow(1000, numberFamily)));
							numericValue = Math.round(numericValue * 10) / 10;
							formattedNum = numericValue + numberFamilySuffixes[numberFamily];
						}
						return formattedNum;
					},
					sortable: true,
					header: 'Domains',
					width: '10%',
					style: {
						textAlign: 'right'
					},
					hoverValue: true
                },
				{
					id: 'active_policies',
					sortComparator: function (a, b) {
						var sortValueA = a.policies ? a.policies.length : -1;
						var sortValueB = b.policies ? b.policies.length : -1;
						return sortValueA - sortValueB;
					},

					value: function (item) {
						return item.policies ? item.policies.length : render.PolicyLoading(this, item);
					},
					sortable: true,
					header: 'Active Policies',
					width: '15%',
					style: {
						textAlign: 'right'
					}
                },
				{
					id: 'edit',
					value: function (item) {
						return render.DownloadEdit(this, item);
					},
					sortable: false,
					header: 'Edit',
					width: '7%',
					style: {
						textAlign: 'center'
					}
                }
            ]
		};
	},

	/** Fires before component is unmounted */
	componentWillMount: function () {
		DomainListActions.getAll();
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		LOGGER.logInfo('componentDidMount');

		DomainListStore.addChangeListener(this._handleChange);
	},

	/** Fires after re-render */
	componentDidUpdate: function (prevProps) {

	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		LOGGER.logInfo('componentWillUnmount');
		DomainListStore.removeChangeListener(this._handleChange);
	},

	_handleChange: function () {
		LOGGER.logInfo('_handleChange');
		let domainLists = DomainListStore.getDomainLists();
		let numDomainLists = domainLists.length;
		LOGGER.logInfo('numDomainLists: ' + numDomainLists);

		this.setState({
			domainLists: domainLists,
			numDataAdded: numDomainLists,
			messageText: numDomainLists === 0 ? 'No domain lists found.' : null,
			isInitialized: DomainListStore.getInitialized()
		});
	},

	/**
	 * Triggers when close button clicked on overlay
	 * @param e {Event} Click event details
	 */
	_handleOverlayClose: function (e) {
		LOGGER.logDebug('_handleOverlayClose - domain lists overlay closed');
		DomainListActions.close();
	},

	/**
	 * Fetches and adds domain lists of next page
	 * Note that dynamic loading is not intended for the table
	 * Therefore this method does nothing but is still required to exist for the datatable component
	 * @return {Promise} returns promise object
	 */
	_requestNextDataPage: function () {

	},

	/**
	 * Fetches and adds lists of previous page. Unlikely to occur as
	 * @return {Promise} returns promise object
	 */
	_requestPrevDataPage: function () {

	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.DomainLists.call(this);
	}

});

export default DomainLists;
