/**
 * App Component
 * This component takes care of all the context that will be passed in to all the child components. e.g.:
 * - is the user logged in or not
 * - who is the logged in user
 * - what's the user role
 * - what are the permissions (role permissions + custom permission) the logged in user has
 */

// libs
import React from 'react';
//components
import Header from '../../../../components/Header';
// stores
import AuthStore from '../../../../stores/AuthStore';
import UserStore from '../../../../stores/UserStore';
import ConfigurationStore from '../../../../stores/ConfigurationStore';
import SiteStore from '../../../../stores/SiteStore';
import CustomerNameStore from '../../../../stores/CustomerNameStore';
import ToastStore from '../../../../stores/Toaster';
// others
import AppConstants from '../../../../constants/AppConstants';
import UserActions from '../../../../actions/UserActions';
import SiteActions from '../../../../actions/SiteActions';
import IdleActions from '../../../../actions/IdleActions';
import RefreshActions from '../../../../actions/RefreshActions';
import OverlayStore from '../../../../stores/OverlayStore';

import render from './render.jsx';

/**
 * App Component
 */
var App = React.createClass({

	/** Context types */
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	/** Get initial states */
	getInitialState: function () {
		return {
			currentPage: "",
			userInfo: UserStore.getUserInfo(),
			customerName: CustomerNameStore.getCustomerName(),
			isAuthenticated: AuthStore.isAuthenticated(),
			sites: null,
			hasApplicationError: false
		};
	},

	/** Fires before component is mounted */
	componentWillMount: function () {
		UserActions.getUserInfo();
		SiteActions.getAllSites();
		IdleActions.resetTimer(ConfigurationStore.getIdleTimeoutSeconds());
		this._setRefreshTimer();
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		OverlayStore.addChangeListener(this._handleOverlayChangeView);
		AuthStore.addChangeListener(this._handleAuthChange);
		UserStore.addChangeListener(this._handleUserInfoChange);
		SiteStore.addChangeListener(this._handleSitesChange);
		ConfigurationStore.addChangeListener(this._handleConfigurationChange);
		ToastStore.addChangeListener(this._handleToastChange);
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		OverlayStore.removeChangeListener(this._handleOverlayChangeView);
		AuthStore.removeChangeListener(this._handleAuthChange);
		UserStore.removeChangeListener(this._handleUserInfoChange);
		SiteStore.removeChangeListener(this._handleSitesChange);
		ToastStore.removeChangeListener(this._handleToastChange);
	},

	/** If auth changed from authenticated to unauthenticated or vice versa */
	_handleAuthChange: function () {
		var isAuthenticated = AuthStore.isAuthenticated();
		this.setState({
			isAuthenticated: isAuthenticated
		});

		if (!isAuthenticated) {
			this.context.router.push(AppConstants.LOGIN_ROUTE + '?redirectTo=' + this.props.location.pathname);
		}
	},

	_handleOverlayChangeView: function () {
		this.setState({
			currentPage: OverlayStore.getCurrentPage()
		});
	},

	/** User info change handler */
	_handleUserInfoChange: function () {
		this.setState({
			userInfo: UserStore.getUserInfo()
		});
	},

	_handleConfigurationChange: function () {
		IdleActions.resetTimer(ConfigurationStore.getIdleTimeoutSeconds());
	},

	_handleToastChange: function () {
		this.setState({
			hasApplicationError: ToastStore.getApplicationErrorOccured()
		});
	},

	_handleKeyDown: function () {
		IdleActions.resetTimer(ConfigurationStore.getIdleTimeoutSeconds());
	},

	_handleMouseDown: function () {
		IdleActions.resetTimer(ConfigurationStore.getIdleTimeoutSeconds());
	},

	_handleWheel: function () {
		IdleActions.resetTimer(ConfigurationStore.getIdleTimeoutSeconds());
	},

	/** When sites changed, update state */
	_handleSitesChange: function () {
		this.setState({
			sites: SiteStore.get()
		});
	},

	_setRefreshTimer: function () {
		var refreshMilliseconds = ConfigurationStore.getTokenRefreshSeconds() * 1000;
		var initialMilliseconds;
		if (AuthStore.getTokenExpiry() == undefined) {
			initialMilliseconds = refreshMilliseconds;
		} else {
			initialMilliseconds = Math.max(0, AuthStore.getTokenExpiry()
				.getTime() - new Date()
				.getTime());
		}
		RefreshActions.resetTimer(initialMilliseconds, refreshMilliseconds);
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		this.childComponent = React.cloneElement(this.props.children);
		this.headerComponent = React.cloneElement(React.createElement(Header, {
			userInfo: this.state.userInfo,
			customerName: this.state.customerName
		}), this.props);
		return render.App.call(this, render);
	}
});

export default App;
