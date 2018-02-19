/**
 * SiteGroups Component
 */
import render from './render.jsx';
import React from 'react'; // eslint-disable-line no-unused-vars
var {
	PropTypes
} = React; // eslint-disable-line no-unused-vars

import SiteGroupActions from '../../actions/SiteGroupActions';
import SiteGroupsStore from '../../stores/SiteGroupsStore';
import naturalCompare from 'natural-compare-lite';
import UserStore from '../../stores/UserStore';

import LogManager from '../../logger/logger';

const LOGGER = LogManager.getLogger('SiteGroups');

/**
 * SiteGroups Component
 */
var SiteGroups = React.createClass({

	/** Get initial state */
	getInitialState: function () {
		var __this = this;
		return {
			isUserAdministrator: __this._getIsUserAdministrator(),
			messageText: null,
			dataTable: null,
			isInitialized: false,
			siteGroups: [],
			zIndexClass: '1',
			isSubmitting: false,
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
					id: 'siteIds',
					sortComparator: function (a, b) {
						return this.value(a) - this.value(b);
					},
					value: function (item) {
						return item.siteIds ? item.siteIds.length : 0;
					},
					sortable: true,
					header: 'Sites',
					width: '10%',
					style: {
						textAlign: 'right'
					}
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
						return render.EditSiteGroup(item,
							__this._handleSiteGroupEdit.bind(null, item),
							__this.state.isUserAdministrator);
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

	componentWillMount: function () {
		SiteGroupActions.getAll();
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		UserStore.addChangeListener(this._handleChangeUserStore);
		SiteGroupsStore.addChangeListener(this._handleChangeSiteGroupStore);
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		UserStore.removeChangeListener(this._handleChangeUserStore);
		SiteGroupsStore.removeChangeListener(this._handleChangeSiteGroupStore);
	},

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
	 * Handles sitegroup store changes event
	 */
	_handleChangeSiteGroupStore: function () {
		let siteGroups = SiteGroupsStore.getSiteGroups();
		let numSiteGroups = siteGroups.length;

		this.setState({
			siteGroups: siteGroups,
			isInitialized: SiteGroupsStore.getInitialized(),
			messageText: numSiteGroups === 0 ? 'No site groups found.' : null
		});
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
	 * Handles site store change events
	 */
	_handleChangeSiteStore: function () {
		this.setState({
			isSiteStoreInitialized: SiteStore.getInitialized()
		});
	},

	/**
	 * Triggers when close button clicked on overlay
	 * @param e {Event} Click event details
	 */
	_handleOverlayClose: function (e) {
		LOGGER.logDebug('_handleOverlayClose - site group overlay closed');
		SiteGroupActions.close();
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.SiteGroups.call(this, render);
	},

	/**
	 * Triggers when add button clicked to add a site group
	 * @param e {Event} Click event details
	 */
	_handleAddButton: function (e) {
		LOGGER.logDebug('_handleAddButton - Add site group button clicked');
		this.setState({
			DisplaySiteGroupForm: true
		});
	},

	/**
	 * Triggers when edit button clicked in data table
	 * @param item {Object} Details of item being edited.
	 */
	_handleSiteGroupEdit: function (item) {
		LOGGER.logDebug('SiteGroup', '_handleSiteGroupEdit - Edit site group button clicked');
		let edit_item = JSON.parse(JSON.stringify(item));

		this.setState({
			currentEditingItem: edit_item
		});
	},

	_handleSiteGroupForm: function (actions) {

		for (var i = actions.length - 1; i >= 0; i--) {

			switch (actions[i]) {
			case 'HIDE_FORM':
				this.setState({
					DisplaySiteGroupForm: false,
					currentEditingItem: null
				});
				LOGGER.logDebug('_handleSiteGroupForm - Add site group overlay closed');
				break;

			}

		}
	}

});

export default SiteGroups;
