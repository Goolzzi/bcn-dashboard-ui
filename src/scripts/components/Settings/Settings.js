/**
 * BLUECAT CONFIDENTIAL INFORMATION. (c) BLUECAT NETWORKS 2016.
 */

import render from './render.jsx';
import React from 'react';

import SettingsActions from '../../actions/SettingsActions';
import UserActions from '../../actions/UserActions';
import SettingsService from '../../services/SettingsService';
import SettingsStore from '../../stores/SettingsStore';
import UserStore from '../../stores/UserStore';
import ToastActions from '../../actions/ToastActions';

const Settings = React.createClass({

	/** Get initial state */
	getInitialState() {
		return {
			isShown: SettingsStore.getIsShown(),
			isDNSEditing: false,
			current_settings: null,
			factory_default_forwarding_ip: '',
			forwarding_dns_ip: '',
			ipError: '',
			get_factory_default_in_progress: false,
			get_settings_in_progress: false,
			update_setting_in_progress: false,
			load_failed: false
		};
	},

	/** Fires after component is mounted */
	componentDidMount() {
		SettingsStore.addChangeListener(this._handleSettingsChange);
	},

	/** Fires before component is unmounted */
	componentWillUnmount() {
		SettingsStore.removeChangeListener(this._handleSettingsChange);
	},

	/**
	 * Validates IP addres format
	 * @param  ipaddress {String} String to be validated
	 * @return {Boolean}           Return true if ipadress is valid
	 */
	_isValidIpV4Address(ipaddress) {
		if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
			return (true);
		}
		return (false);
	},

	/**
	 * Closes overlay
	 */
	_handleOverlayClose() {
		SettingsActions.hide();
	},

	/**
	 * Enable DNS edit field box
	 */
	_handleDNSEdit() {
		this.setState({
			isDNSEditing: true
		});
	},

	_openProfile() {
		UserActions.showProfile();
		// this.setState({profileScreen: true});
	},

	// _closeProfile() {
	// this.setState({profileScreen: false});
	// },

	/**
	 * Retrieve settings of current user.
	 */
	_getSettings() {
		this.setState({
			get_settings_in_progress: true
		});
		SettingsService.getSettings()
			.then(function (resp) {
				var ip = '';
				if (typeof (resp) === 'string') {
					var newSettings = JSON.parse(resp);
					if (newSettings.hasOwnProperty('servers')) {
						ip = newSettings.servers[0].ipAddress;
					}
				} else {
					if (resp.hasOwnProperty('servers')) {
						ip = resp.servers[0].ipAddress;
					}
				}
				this.setState({
					current_settings: {
						forwarding_dns_ip: ip
					},
					forwarding_dns_ip: ip,
					get_settings_in_progress: false
				});
			}.bind(this))
			.catch(function () {
				ToastActions.toast('error', 'Unable to retrieve current settings. Please refresh to try again or contact your administrator if the issue persists.');
				this.setState({
					load_failed: true,
					get_settings_in_progress: false
				});
			}.bind(this));
	},

	/**
	 * Retrieves default/factory settings
	 */
	_getFactorySettings() {
		this.setState({
			get_factory_default_in_progress: true
		});
		SettingsService.getFactorySettings()
			.then(function (resp) {
				var ip = '';
				if (typeof (resp) === 'string') {
					var newSettings = JSON.parse(resp);
					if (newSettings.hasOwnProperty('servers')) {
						ip = newSettings.servers[0].ipAddress;
					}
				} else {
					if (resp.hasOwnProperty('servers')) {
						ip = resp.servers[0].ipAddress;
					}
				}
				this.setState({
					factory_default_forwarding_ip: ip,
					get_factory_default_in_progress: false
				});
			}.bind(this))
			.catch(function () {
				ToastActions.toast('error', 'Unable to retrieve factory settings. Please refresh to try again or contact your administrator if the issue persists.');
				this.setState({
					load_failed: true,
					get_factory_default_in_progress: false
				});
			}.bind(this));
	},

	/**
	 * Update user provided IP address as DNS Forwarder
	 * @param  e {Event}
	 */
	_handleUpdateSettings(e) {

		if (this.refs.forwarding_dns_ip.value !== '' &&
			this._isValidIpV4Address(this.refs.forwarding_dns_ip.value) === false) {
			this.setState({
				ipError: 'Please enter a valid IP address'
			});
			return;
		}

		this.setState({
			update_setting_in_progress: true
		});

		SettingsService.updateSettings({
				forwarding_dns_ip: this.refs.forwarding_dns_ip.value
			})
			.then(function (resp) {
				this.setState({
					ipError: '',
					isDNSEditing: false,
					forwarding_dns_ip: this.refs.forwarding_dns_ip.value,
					update_setting_in_progress: false
				});
			}.bind(this))
			.catch(function () {
				ToastActions.toast('error', 'An error occured while attempting to update settings. Please refresh to try again or contact your administrator if the issue persists.');
				this.setState({
					ipError: '',
					update_setting_in_progress: false
				});
			}.bind(this));
	},

	/**
	 * Handles changes in the  settings store
	 */
	_handleSettingsChange() {
		var showModal = SettingsStore.getIsShown();
		if (showModal && !this.state.isShown) {
			this._getFactorySettings();
			this._getSettings();
			this.setState({
				isShown: true,
				load_failed: false,
				current_settings: null,
				factory_default_forwarding_ip: '',
				forwarding_dns_ip: '',
				ipError: ''
			});
		} else {
			this.setState({
				isShown: false
			});
		}
	},

	/**
	 * Handler for DNS Forwarding IP input box
	 * @param  event {Event} Input box event
	 */
	_handleInputChange(event) {
		if (this.state.ipError.length !== 0) {
			this.setState({
				ipError: ''
			});
		}
		this.setState({
			forwarding_dns_ip: event.target.value
		});

		// console.log('dns ip is: ' + this.state.forwarding_dns_ip);
	},

	/**
	 * Should DNS Forwarding be allowed to change
	 * @return {Boolean} return true if IP should not be edited
	 */
	_isDisabled() {
		return ((this.state.get_factory_default_in_progress ||
			this.state.get_settings_in_progress ||
			this.state.update_setting_in_progress) ? true : false);
	},

	/**
	 * Switch back to readonly mode
	 */
	_handleCloseButton() {
		this.setState({
			isDNSEditing: false
		});
	},

	_isUserAdministrator() {
		return UserStore.getUserInfo()
			.isAdministrator();
	},

	/**
	 * Check if IP was changed
	 * @return {Boolean} Return true if IP has changed
	 */
	_isDirty() {
		return (this.state.current_settings.forwarding_dns_ip !== this.state.forwarding_dns_ip);
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render() {
		return render.Settings.call(this);
	}
});

export default Settings;
