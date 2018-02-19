import React from 'react';
import render from './render.jsx';

/**
 * EditableTable Component
 */
var EditableTable = React.createClass({

	/** Property Types */
	propTypes: {
		tableId: React.PropTypes.string.isRequired,
		metadata: React.PropTypes.arrayOf(React.PropTypes.shape({
				header: React.PropTypes.string.isRequired,
				value: React.PropTypes.func.isRequired,
				width: React.PropTypes.string.isRequired,
				isDisabled: React.PropTypes.bool,
				isActionsField: React.PropTypes.bool,
				placeholder: React.PropTypes.string
			}))
			.isRequired,
		validateData: React.PropTypes.func.isRequired,
		data: React.PropTypes.array.isRequired,
		newData: React.PropTypes.object.isRequired,
		isSubmitting: React.PropTypes.bool.isRequired,
		handleOnChange: React.PropTypes.func.isRequired,
		handleOnClear: React.PropTypes.func.isRequired,
		messageText: React.PropTypes.string,
		isFetchingData: React.PropTypes.bool.isRequired,
		actionContext: React.PropTypes.object

	},

	/** Get initial state */
	getInitialState: function () {
		return {
			headers: this.props.metadata.map(col => {
				return React.createElement('th', {
					style: {
						width: col.width
					},
					key: col.header
				}, col.header);
			})
		};
	},

	/**
	 * make table rows
	 * @return {Component[]}
	 */
	_makeRows: function () {
		if (this.props.data === null) {
			return;
		}

		return this.props.data.map((row, rowIndex) => {
			return React.createElement('tr', {
				key: 'editableTable-row-' + rowIndex
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
			if (col.hasOwnProperty('render')) {
				return React.createElement('td', {
					key: 'editableTable-row-' + rowIndex + '-col-' + colIndex,
					style: {
						width: col.width,
						padding: '0%',
						'textOverflow': 'clip'
					}
				}, col.render.call(this.props.actionContext, row));
			}

			return React.createElement('td', {
				key: 'editableTable-row-' + rowIndex + '-col-' + colIndex,
				style: {
					width: col.width
				}
			}, col.value(row));
		});
	},

	_makeAddElementRow: function () {
		var cols = this.props.metadata.map((col, colIndex) => {
			if (col.hasOwnProperty('isActionsField') && col.isActionsField) {
				return render.AddActionColumn(this.props.isSubmitting, col.width, 'editableTable-addRow-col-' + colIndex);
			} else {
				return render.AddElementColumn(this, col, 'editableTable-addRow-col-' + colIndex);
			}
		});

		return React.createElement('tr', {
			key: 'editableTable-addRow'
		}, cols);
	},

	_handleOnChange: function (ename, e) {
		this.props.handleOnChange(ename, e.target.value);
	},

	_handleSubmit: function (e) {
		e.preventDefault();
		// start validation
		this.props.validateData();
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.EditableTable.call(this);
	}
});

export default EditableTable;
