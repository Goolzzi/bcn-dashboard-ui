/**
 * Policies Component
 */
import render from './render.jsx';
import React from 'react'; // eslint-disable-line no-unused-vars

import PolicyActions from '../../actions/PolicyActions';
import PolicyStore from '../../stores/PolicyStore';
import UserStore from '../../stores/UserStore';
import naturalCompare from 'natural-compare-lite';

import LogManager from '../../logger/logger';

const LOGGER = LogManager.getLogger('Policies');


const ACTIVE_STATUS_TEXT = 'active';
const INACTIVE_STATUS_TEXT = 'inactive';
/**
 * Policies Component
 */
var Policies = React.createClass({

	/** Get initial state */
	getInitialState: function () {
		return {
			messageText: null,
			numDataAdded: 0,
			dataTable: null,
			policies: [],
			zIndexClass: '1',
			isInitialized: false,
			currentEditingItem: null,
			DisplayPolicyForm: false,
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
					id: 'action',
					sortComparator: function (a, b) {
						return a.action.type.localeCompare(b.action.type);
					},
					value: function (item) {
						if (item.action.type == 'monitor') {
							return render.PolicyMonitor(this, item);
						} else {
							return render.PolicyBlock(this, item);
						}
					},
					sortable: true,
					header: 'Action',
					width: '10%',
					style: {
						textAlign: 'center'
					}
        		},
				{
					id: 'status',
					//Policy comparison on status reversed because of true=active, false=inactive
					sortComparator: function (a, b) {
						return b.active.toString()
							.localeCompare(a.active.toString());
					},
					value: function (item) {
						return item.active ? render.PolicyActive(this, ACTIVE_STATUS_TEXT) : render.PolicyInactive(this, INACTIVE_STATUS_TEXT);
					},
					sortable: true,
					header: 'Status',
					width: '15%',
					style: {
						textAlign: 'center'
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
		PolicyActions.getAll();
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		UserStore.addChangeListener(this._handleChangeUserStore);
		PolicyStore.addChangeListener(this._handleChangePolicyStore);
	},

	/** Fires after re-render */
	componentDidUpdate: function (prevProps) {

	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		UserStore.removeChangeListener(this._handleChangeUserStore);
		PolicyStore.removeChangeListener(this._handleChangePolicyStore);
	},

	/**
	 *  Fetches if user is an administrator
	 */
	_getIsUserAdministrator: function () {
		if (!UserStore.getInitialized()) {
			return false;
		}

		const userInfo = UserStore.getUserInfo();
		if (!userInfo) {
			return false;
		}
		return userInfo.isAdministrator();
	},


	/**
	 * Handles user store change events
	 */
	_handleChangeUserStore: function () {
		this.setState({
			isUserAdministrator: this._getIsUserAdministrator()
		});
	},

	/**
	 * Handles policy store change events
	 */
	_handleChangePolicyStore: function () {
		let policies = PolicyStore.getPolicies();
		let numPolicies = policies.length;
		if (numPolicies === 0) {
			this.setState({
				policies: [],
				numDataAdded: 0,
				messageText: 'No policies found.',
				isInitialized: PolicyStore.getInitialized()
			});
		} else {
			this.setState({
				policies: policies,
				numDataAdded: numPolicies,
				messageText: null,
				isInitialized: PolicyStore.getInitialized()
			});
		}

	},

	/**
	 * Triggers when close button clicked on overlay
	 * @param e {Event} Click event details
	 */
	_handleOverlayClose: function (e) {
		LOGGER.logDebug('Policy', '_handleOverlayClose - policy overlay closed');
		PolicyActions.close();
	},

	/**
	 * Fetches and adds policies of next page
	 * Note that dynamic loading is not intended for the policies table
	 * Therefore this method does nothing but is still required to exist for the datatable component
	 * @return {Promise} returns promise object
	 */
	_requestNextDataPage: function () {

	},

	/**
	 * Fetches and adds policies of previous page. Unlikely to occur as
	 * @return {Promise} returns promise object
	 */
	_requestPrevDataPage: function () {

	},

	/**
	 * Triggers when add button clicked to add a policy
	 * @param e {Event} Click event details
	 */
	_handleAddButton: function (e) {
		LOGGER.logDebug('_handleAddButton - Add policy button clicked');
		this.setState({
			DisplayPolicyForm: true
		});
	},

	/**
	 * Triggers when edit button clicked in data table
	 * @param item {Object} Details of item being edited.
	 */
	_handlePolicyEdit: function (item) {
		LOGGER.logDebug('Policies', '_handlePolicyEdit - Edit policy button clicked');
		let edit_item = JSON.parse(JSON.stringify(item));

		this.setState({
			currentEditingItem: edit_item
		});
	},

	_handlePolicyForm: function (actions) {

		for (var i = actions.length - 1; i >= 0; i--) {

			switch (actions[i]) {
			case 'HIDE_FORM':
				this.setState({
					DisplayPolicyForm: false,
					currentEditingItem: null
				});
				LOGGER.logDebug('_handlePolicyForm - Add policy overlay closed');
				break;

			}

		}
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Policies.call(this, render);
	}

});

export default Policies;
