import React from 'react';
import ReactDOM from 'react-dom';
import render from './render.jsx';
import _ from 'lodash';
import stableSort from 'stable';

import LogManager from '../../logger/logger';

const LOGGER = LogManager.getLogger('DataTable');

/**
 * DataTableHeader component that appears in header of sortable columns
 */

var DataTableHeader = React.createClass({ // eslint-disable-line no-unused-vars
	propTypes: {
		sortable: React.PropTypes.bool.isRequired,
		sort: React.PropTypes.string,
		value: React.PropTypes.string.isRequired
	},

	render: function () {
		return render.DataTableHeader.call(this);
	}
});

/**
 * DataTable Component
 */
var DataTable = React.createClass({

	isLoadingNextData: false,
	isLoadingPrevData: false,

	/** Property Types */
	propTypes: {
		tableId: React.PropTypes.string.isRequired,
		metadata: React.PropTypes.arrayOf(React.PropTypes.shape({
				header: React.PropTypes.string.isRequired,
				value: React.PropTypes.func.isRequired,
				width: React.PropTypes.string.isRequired,
				style: React.PropTypes.object
			}))
			.isRequired,
		data: React.PropTypes.array.isRequired,
		defaultSort: React.PropTypes.shape({
			headerId: React.PropTypes.string,
			sortType: React.PropTypes.string
		}),
		numDataAdded: React.PropTypes.number.isRequired,
		requestNextDataPage: React.PropTypes.func.isRequired,
		requestPrevDataPage: React.PropTypes.func.isRequired,
		isFetchingPrevDataPage: React.PropTypes.bool.isRequired,
		isFetchingNextDataPage: React.PropTypes.bool.isRequired,
		messageText: React.PropTypes.string
	},

	/** Get initial state */
	getInitialState: function () {
		this.componentDidUpdateInProcess = false;
		return {
			tableBodyWidth: null,
			defaultSortHeaderId: this.props.defaultSort ? this.props.defaultSort.headerId : null,
			dataSort: this.props.defaultSort
		};
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		this._tableBody = ReactDOM.findDOMNode(this)
			.querySelector('.table-body');
		this._throttledHandleScroll = _.throttle(this._handleScroll, 500);
		this._tableBody.addEventListener('scroll', this._throttledHandleScroll);
		// window.addEventListener('resize', this._windowResized);
	},

	/** Fires after re-render */
	componentDidUpdate: function (prevProps) {
		if (this.props.data.length === this.props.numDataAdded) {
			return;
		}

		var tableBody = ReactDOM.findDOMNode(this)
			.querySelector('.table-body');
		if (this.isLoadingNextData === true && this.props.isFetchingNextDataPage === false) {
			tableBody.scrollTop = ((tableBody.scrollHeight / this.props.data.length) * (this.props.data.length - this.props.numDataAdded)) - tableBody.clientHeight;
			this.isLoadingNextData = false;
		} else if (this.isLoadingPrevData === true && this.props.isFetchingPrevDataPage === false) {
			tableBody.scrollTop = ((tableBody.scrollHeight / this.props.data.length) * (this.props.numDataAdded));
			this.isLoadingPrevData = false;
		}
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		this._tableBody.removeEventListener('scroll', this._throttledHandleScroll);
	},

	/**
	 * Handles scroll event on tableBody
	 * @param e {Event} DOM scroll event
	 */
	_handleScroll: function (e) {
		this._checkScrollPosition(e.target);
	},

	/**
	 * Handles scroll event on tableBody
	 * @param e {Event} DOM scroll event
	 */
	_checkScrollPosition: function (target) {

		if (this.props.messageText !== null ||
			this.props.isFetchingNextDataPage ||
			this.props.isFetchingPrevDataPage ||
			this.props.data.length === 0) {
			return;
		}

		if ((Math.ceil(target.clientHeight + target.scrollTop) >= target.scrollHeight ||
				Math.ceil(target.offsetHeight + target.scrollTop) >= target.scrollHeight)) {
			LOGGER.logDebug('_checkScrollPosition - requesting next page ');
			this.isLoadingNextData = this.props.requestNextDataPage();
			this.isLoadingPrevData = false;
		} else if (target.scrollTop === 0) {
			LOGGER.logDebug('_checkScrollPosition - requesting prev page ');
			this.isLoadingPrevData = this.props.requestPrevDataPage();
			this.isLoadingNextData = false;
		}
	},

	_getSortedData: function () {
		var sortedData = this.props.data;
		if (this.state.dataSort) {
			var sortHeaderId = this.state.dataSort.headerId;
			var sortHeaderIndex = _.findIndex(this.props.metadata, function (m) {
				return m.id === sortHeaderId;
			});

			var secondarySortHeaderId = this.state.defaultSortHeaderId;
			var secondarySortHeaderIndex = _.findIndex(this.props.metadata, function (m) {
				return m.id === secondarySortHeaderId;
			});

			var primarySortComparator = this.props.metadata[sortHeaderIndex].sortComparator.bind(this.props.metadata[sortHeaderIndex]);
			var secondarySortComparator = sortHeaderIndex !== secondarySortHeaderIndex ?
				this.props.metadata[secondarySortHeaderIndex].sortComparator.bind(this.props.metadata[secondarySortHeaderIndex]) : null;
			var sortOrderModifier = ((this.state.dataSort.sort === 'asc') ? 1 : -1);

			sortedData = stableSort(this.props.data, function (a, b) {
				var sortValue = primarySortComparator(a, b) * sortOrderModifier;
				if (sortValue === 0 && secondarySortComparator) {
					sortValue = secondarySortComparator(a, b);
				}
				return sortValue;
			});
		}
		return sortedData;
	},

	/**
	 * Make table rows
	 * @return {Component[]}
	 */
	_makeRows: function () {
		var sortedData = this._getSortedData();
		return sortedData.map((row, rowIndex) => {
			return React.createElement('tr', {
				key: 'datatable-row-' + rowIndex
			}, this._makeCols(row, rowIndex));
		})
	},

	/**
	 * Using column metadata, make table columns
	 * @param row {Object}
	 * @return {Component[]}
	 */
	_makeCols: function (row, rowIndex) {
		return this.props.metadata.map((col, colIndex) => {
			return React.createElement('td', {
				key: 'datatable-row-' + rowIndex + '-col-' + colIndex,
				style: _.merge({
					width: col.width,
					color: col.color ? col.color(row) : undefined
				}, col.style),
				title: col.hoverValue ? col.value(row) : '',
				className: col.className
			}, col.value(row));
		});
	},

	/**
	 * Generate table headings from input metadata
	 * @return {Component[]}
	 */
	_makeHeaders: function () {
		LOGGER.logDebug('DataTable', '_getHeaders - generating headers ');
		return this.props.metadata.map(function (m) {

			m.style = _.merge({
				width: m.width
			}, m.style);

			var props = {
				key: m.header,
				style: m.style,
				className: m.className + ' ' + m.headerClassName,
				onClick: null
			};
			var isSortable = ('sortable' in m) && m.sortable === true;

			if (isSortable) {
				props.onClick = this._updateSortHeader.bind(null, m);
			} else {
				props.onClick = null;
			}

			var sortType = '';
			if (this.state.dataSort && this.state.dataSort.headerId === m.id) {
				sortType = this.state.dataSort.sort;
			}
			var r = React.createElement('th', props, React.createElement(DataTableHeader, {
				sortable: isSortable,
				sort: sortType,
				value: m.header
			}));

			return r;

		}.bind(this));
	},

	_updateSortHeader: function (headerCol) {
		var dataSort = this.state.dataSort;
		if (dataSort && dataSort.headerId === headerCol.id) {
			if (dataSort.sort === 'asc') {
				dataSort.sort = 'desc';
			} else {
				dataSort.sort = 'asc';
			}
		} else {
			dataSort = {
				sort: 'asc',
				headerId: headerCol.id
			}
		}

		this.setState({
			dataSort: dataSort
		});
	},



	// /** Fires when window resized */
	// _windowResized: function() {
	// 	LOGGER.logDebug('DataTable', '_windowResized');
	//     this._matchHeaderBodyWidth();
	// },

	// /** Matches table width of header with table width of body */
	// _matchHeaderBodyWidth: function () {
	// 	LOGGER.logDebug('DataTable', '_matchHeaderBodyWidth - synchronizing header and body width ');
	//     if(this.refs.tableHeaderElem && this.refs.tableHeaderElem.offsetWidth != this.state.tableBodyWidth)
	//         this.setState({ tableBodyWidth:this.refs.tableHeaderElem.offsetWidth });
	// },

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.DataTable.call(this);
	}
});

export default DataTable;
