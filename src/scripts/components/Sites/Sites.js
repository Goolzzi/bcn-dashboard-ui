/**
 * BLUECAT CONFIDENTIAL INFORMATION. (c) BLUECAT NETWORKS 2016.
 */
import _ from 'lodash';
import render from './render.jsx';
import React from 'react';

import SiteActions from '../../actions/SiteActions';
import ToastActions from '../../actions/ToastActions';
import SiteImageDownloadActions from '../../actions/SiteImageDownloadActions';

import SettingsService from '../../services/SettingsService';

import SettingsStore from '../../stores/SettingsStore';
import SiteStore from '../../stores/SiteStore';
import SiteService from '../../services/SiteService';
import SiteImageDownloadStore from '../../stores/SiteImageDownloadStore';

import SiteImageStatus from '../../constants/SiteImageStatus';

import LogManager from '../../logger/logger'

const LOGGER = LogManager.getLogger('Sites');

var Sites = React.createClass({

	sitesTableMetadata: [
		{
			header: 'Name',
			inputName: 'name',
			value: function (item) {
				return item.siteName;
			},
			width: '35%',
			isDisabled: false
        },
		{
			header: 'Location',
			inputName: 'location',
			value: function (item) {
				return item.location.lat + ', ' + item.location.lng;
			},
			width: '30%',
			isDisabled: false
        },
		{
			header: 'Forwarding DNS',
			inputName: 'forwardingDNS',
			inputEdit: 'ip',

			value: function (item) {
				return '';
			},

			render: function (item) {
				if (item.siteId == this.state.editingSiteId && item.siteId != null) {
					console.log('rendering edit box: forwarding_dns_ip = ' + this.state.forwarding_dns_ip);

					return render.AddTextBoxAction(this, item, this.state.default_DNS_Setting, this.state.forwarding_dns_ip, this.state.messageEditText);

				} else if (item.dnsSettings.source == 'GLOBAL' || item.dnsSettings.source == 'FACTORY') {
					// default settings - show in italics

					return render.DefaultFordwaringIp(item['dnsSettings']['settings'].servers[0].ipAddress);


				} else {
					return item['dnsSettings']['settings'].servers[0].ipAddress;
				}
			},

			width: '18%',
			isDisabled: false,
			isActionsField: false
        },
		{
			header: 'Action',
			inputName: 'action',
			value: function (item) {
				return '';
			},
			render: function (item) {

				var siteImage = {
					status: SiteImageStatus.NOT_FOUND
				};
				if (item.hasOwnProperty('image')) {
					siteImage = _.cloneDeep(item.image);
				}

				if (siteImage.status === SiteImageStatus.NOT_FOUND) {
					if (this.state.siteImageDownloads[item.siteId] !== undefined) {
						siteImage.status = SiteImageStatus.IN_PROGRESS;
					}
				}

				return render.DownloadAction(this, item, siteImage, this.state.editingSiteId);
			},
			width: '20%',
			isDisabled: false,
			isActionsField: true
        }
    ],

	/** Context types */
	contextTypes: {},
	geocoder: null,
	newSite: {},
	refreshTimerToken: null,

	/** Get initial state */
	getInitialState: function () {
		return {
			default_DNS_Setting: '',
			sites: [],
			metadata: this.sitesTableMetadata,
			isSubmitting: false,
			messageText: null,
			messageEditText: null,
			newData: this._createInitialSiteData(),
			isFetchingData: true,
			siteImageDownloads: SiteImageDownloadStore.get(),
			hover: false,
			showText: false,
			editingSiteId: null,
			forwarding_dns_ip: '',
			zIndexClass: '1'
		};


	},

	componentWillMount: function () {
		LOGGER.logInfo('Sites', 'componentWillMount');
		SiteActions.getAllSites();
		this.setState({
			sites: this._getSitesSortedByName()
		});

		SettingsStore.addChangeListener(this._handleSettingsChange);
		SiteImageDownloadStore.addChangeListener(this._handleSiteImageDownloadChange);
		this._updateRefreshTimer();
		this._getDefaultDNSSetting();
	},

	_getDefaultDNSSetting: function () {
		LOGGER.logInfo('Sites', '_getDefaultDNSSetting');
		this.setState({
			isFetchingData: true
		});
		SettingsService.getSettings()
			.then(function (resp) {
				if (resp.hasOwnProperty('servers')) {
					if (resp.servers[0].ipAddress) {
						this.setState({
							default_DNS_Setting: resp.servers[0].ipAddress,
							isFetchingData: false
						});
						this._handleSitesChange();
						return;
					} else {
						this._getFactorySettings();
						return;
					}
				} else {
					this._getFactorySettings();
					return;
				}
			}.bind(this))
			.catch(function (jqXHR, textStatus, errorThrown) {
				var toastString = 'Failed to load default DNS setting. Please refresh to try again or contact your administrator if the issue persists.';

				ToastActions.toast('application-error', toastString);

				this.setState({
					messageText: null,
					isSubmitting: false,
					default_DNS_Setting: '(failed to load default DNS)',
					isFetchingData: false
				});
				this._handleSitesChange();
			}.bind(this));
	},

	_getFactorySettings: function () {
		LOGGER.logInfo('Sites', '_getFactorySettings');
		SettingsService.getFactorySettings()
			.then(function (resp) {
				if (resp.hasOwnProperty('servers')) {
					LOGGER.logDebug('_getFactorySettings 1: ' + resp.servers[0].ipAddress);
					this.setState({
						default_DNS_Setting: resp.servers[0].ipAddress,
						isFetchingData: false
					});
					this._handleSitesChange();
					return;
				}
			}.bind(this))
			.catch(function (jqXHR, textStatus, errorThrown) {
				var toastString = 'Failed to load factory default DNS setting. Please refresh to try again or contact your administrator if the issue persists.';

				ToastActions.toast('application-error', toastString);

				this.setState({
					messageText: null,
					isSubmitting: false,
					default_DNS_Setting: '(failed to load default DNS)',
					isFetchingData: false
				});
				this._handleSitesChange();
			}.bind(this));
	},

	_createInitialSiteData: function () {
		return {
			name: '',
			location: '',
			forwardingDNS: ''
		};
	},

	_getSitesSortedByName: function () {
		var unsortedSites = _.cloneDeep(SiteStore.get());
		if (unsortedSites === null) {
			return [];
		}

		return _.sortBy(unsortedSites, function (site) {
			return site.siteName.toLowerCase();
		});
	},

	_getGeocoder: function () {
		if (this.geocoder === null) {
			this.geocoder = new window.google.maps.Geocoder();
		}
		return this.geocoder;
	},

	_getLatLng: function (address) {
		var geocoder = this._getGeocoder();
		if (geocoder === null || typeof geocoder.geocode !== 'function') {
			LOGGER.logError('Error obtaining google geocoder');
			// TODO: Add toast message
			this._doneSiteValidation(this.newSite, 'Could not contact Geolocation service. Please try again later.');
			return;
		}

		geocoder.geocode({
			'address': address
		}, function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				LOGGER.logDebug('_getLatLng results:' + JSON.stringify(results));
				if (results.length > 1) {
					this._doneSiteValidation(this.newSite, 'This address has multiple matches. Please check address and try again.');
				} else {
					this.newSite.location = results[0].geometry.location;
					this._doneSiteValidation(this.newSite, null);
				}
			} else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
				this._doneSiteValidation(this.newSite, 'Could not validate location. Please check address and try again.');
			} else {
				LOGGER.logError('Geocode was not successful for the following reason: ' + status);
				this._doneSiteValidation(this.newSite, 'Could not contact Geolocation service. Please try again later.');
			}
		}.bind(this));
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		SiteStore.addChangeListener(this._handleSitesChange);
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		SiteStore.removeChangeListener(this._handleSitesChange);
		SettingsStore.removeChangeListener(this._handleSettingsChange);
		SiteImageDownloadStore.removeChangeListener(this._handleSiteImageDownloadChange);
		this._removeRefreshTimer();
	},

	_updateRefreshTimer: function () {

		if (this.refreshTimerToken !== null) {
			return;
		}

		this.refreshTimerToken = setInterval(function () {
			console.log('timer get all sites');
			SiteActions.getAllSites()
				.then(() => {
					console.log('success');
					ToastActions.removeByType('refresh-error')
				})
				.catch(function (jqXHR, textStatus, errorThrown) {
					console.log('failure');
					ToastActions.toast('refresh-error', 'Failed to update sites. Please refresh to try again or contact your administrator if the issue persists.');
				});
		}.bind(this), 30 * 1000);
	},

	_removeRefreshTimer: function () {
		if (this.refreshTimerToken === null) {
			return;
		}
		clearInterval(this.refreshTimerToken);
		this.refreshTimerToken = null;
	},

	_handleSitesChange: function () {
		LOGGER.logInfo('_handleSitesChange');

		this.sitesTableMetadata.filter(function (obj) {
			return obj.inputName === 'forwardingDNS';
		})[0].placeholder = this.state.default_DNS_Setting;
		this.setState({
			sites: this._getSitesSortedByName()
		});
	},

	_handleSettingsChange: function () {
		LOGGER.logInfo('_handleSettingsChange');
		if (SettingsStore.get() === false) {
			this._getDefaultDNSSetting();
		}
	},

	_handleSiteImageDownloadChange: function () {
		LOGGER.logInfo('_handleSiteImageDownloadChange');
		this.setState({
			siteImageDownloads: SiteImageDownloadStore.get()
		});
	},

	_handleDownloadSiteImage: function (site) {
		LOGGER.logInfo('_handleDownloadSiteImage');
		SiteImageDownloadActions.requestSiteImage(site.siteId)
			.catch(function () {
				ToastActions.removeAll();
				ToastActions.toast('error', 'The download for site \'' + site.siteName + '\' could not be generated at this time. Please try again later.');

			});

	},

	/**
	 * Triggers when close button clicked on overlay
	 * @param e {Event} Click event details
	 */
	_handleOverlayClose: function (e) {
		LOGGER.logDebug('Sites', '_handleOverlayClose - sites overlay closed');
		SiteActions.close();
	},

	_handleOnChange: function (name, value) {
		var changedData = Object.assign({}, this.state.newData);
		changedData[name] = value;
		this.setState({
			newData: changedData
		});

	},

	_handleDNSEditOnChange: function (event) {

		console.log('forwarding ip is: ' + this.state.forwarding_dns_ip);
		this.setState({
			forwarding_dns_ip: event.target.value

		});

	},

	_handleDNSUpdateSettings: function (site) {

		if (this.state.forwarding_dns_ip === '' || this._isValidIpAddress(this.state.forwarding_dns_ip)) {

			if (site.siteId != this.state.editingSiteId) {
				LOGGER.logInfo('Site is not the same as the editing site');
				return;
			}
			site.dnsSettings.settings.servers[0].ipAddress = '';
			SiteService.updateSite(site.siteName, this.state.forwarding_dns_ip)
				.then(() => {
					LOGGER.logInfo('_handleDNSUpdateSettings succeeded');

					SiteActions.getAllSites()
						.then(() => {
							LOGGER.logInfo('_handleDNSUpdateSettings updated site: ' + this.state.editingSiteId);
							this.setState({
								messageEditText: null,
								isSubmitting: true,
								editingSiteId: null
							});
						})
						.catch(function (jqXHR, textStatus, errorThrown) {
							ToastActions.toast('application-error', 'Failed to update site. Please refresh to try again or contact your administrator if the issue persists.');
						});

				})
				.catch(function (jqXHR, textStatus, errorThrown) {
					LOGGER.logError('_handleDNSUpdateSettings failed');
					var toastString = 'Failed to update DNS IP. Please refresh and try again';
					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							if (responseObject.hasOwnProperty('code') && responseObject.code === 'UPDATE_SITE_ERROR') {
								toastString = 'Failed to update site, please refresh and try again';
							}

						}
					} catch (err) {
						LOGGER.loginfo('Error when updating ip');
					}

					ToastActions.toast('error', toastString);

					this.setState({
						messageEditText: null,
						isSubmitting: false
					});
				}.bind(this));
		} else {
			this.setState({
				messageEditText: 'Please enter a valid IP address.',
				isSubmitting: false
			});
		}



	},

	_handleOnClear: function () {
		this.setState({
			newData: this._createInitialSiteData()
		});
	},

	_handleEditDNSSettings: function (site) {
		LOGGER.logInfo('the siteId is: ' + site.siteId);
		LOGGER.logInfo('when handling edit, this is: ' + this);

		var whatTextShouldBe = site.dnsSettings.settings.servers[0].ipAddress;

		if (site.dnsSettings.source != 'SITE') {
			// GLOBAL or FACTORY
			whatTextShouldBe = '';
		}

		this.setState({
			editingSiteId: site.siteId,
			forwarding_dns_ip: whatTextShouldBe,
			messageEditText: null
		});
	},

	_handleDNSEditClear: function () {

		this.setState({
			editingSiteId: null
		});

		console.log('The clear state is: ' + this.state.clear);
	},


	_validateSiteName: function (sname) {
		var valid = false;
		var siteName = sname.trim();

		if (siteName) {
			if (siteName.charAt(0) == '/') {
				this._doneSiteValidation(this.newSite, 'Name cannot start with a slash (/). Please rename this site.');
			} else if (siteName.search(' /') === -1) {
				// Check for dupes
				var dupSite = _.find(this.state.sites, function (s) {
					return s.siteName.toLowerCase() === siteName.toLowerCase();
				});

				if (dupSite) {
					this._doneSiteValidation(this.newSite, 'Site name already exists. Please rename this site.');
				} else {
					this.newSite.siteName = siteName;
					valid = true;
				}
			} else {
				this._doneSiteValidation(this.newSite, 'Name cannot contain a space followed by a slash ( /). Please rename this site.');
			}
		} else {
			this._doneSiteValidation(this.newSite, 'Enter a name for this site.');
		}
		return valid;
	},

	_validateNewSiteData: function () {
		ToastActions.removeAll();
		LOGGER.logInfo('_validateNewSiteData: ' + JSON.stringify(this.state.newData));

		this.setState({
			isSubmitting: true
		});
		if (this._validateSiteName(this.state.newData['name'])) {
			if (this._validateDNSForwarding(this.state.newData['forwardingDNS'])) {
				if (this.state.newData['location'].length > 0) {
					this._getLatLng(this.state.newData['location']);
				} else {
					this._doneSiteValidation(this.newSite, 'Specify a location for this site.');
				}
			}
		}
	},

	_isValidIpAddress(ip) {
		return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
	},

	_validateDNSForwarding: function (setting) {
		if (this._isValidIpAddress(setting)) {
			this.newSite['settings'] = {
				'servers': [{
					'ipAddress': setting
				}]
			};
		} else if (setting.length === 0) {
			this.newSite['settings'] = {
				'servers': [{
					'ipAddress': ''
				}]
			};
		} else {
			this._doneSiteValidation(this.newSite, 'Please enter a valid IP address.');
			return false;
		}
		return true;
	},

	_doneSiteValidation: function (site, error) {
		if (error) {
			LOGGER.logError('_doneSiteValidation error: ' + error);
			this.setState({
				messageText: error,
				isSubmitting: false
			});
		} else {
			LOGGER.logInfo('_doneSiteValidation: ' + JSON.stringify(site));
			this._addNewSiteData(site);
		}
	},

	_addNewSiteData: function (site) {
		LOGGER.logInfo('_addNewSiteData: ' + JSON.stringify(site));
		SiteActions.createSite(site)
			.then(() => {
				LOGGER.logInfo('_addNewSiteData create site succeeded.');
				this.setState({
					messageText: null,
					isSubmitting: false,
					newData: this._createInitialSiteData()
				});

				SiteActions.getAllSites()
					.then(() => {
						LOGGER.logInfo('_addNewSiteData updated all sites')
					})
					.catch(function (jqXHR, textStatus, errorThrown) {
						ToastActions.toast('application-error', 'Failed to update sites. Please refresh to try again or contact your administrator if the issue persists.');
					});
			})
			.catch(function (jqXHR, textStatus, errorThrown) {
				LOGGER.logError('_addNewSiteData create site failed.');
				var toastString = 'Failed to create site. Please refresh to try again or contact your administrator if the issue persists.';
				try {
					if (jqXHR && jqXHR.responseText) {
						var responseObject = JSON.parse(jqXHR.responseText);
						if (responseObject.hasOwnProperty('code') && responseObject.code === 'CREATE_SITE_SETTINGS_ERROR') {
							toastString = 'Site created, but failed to set site DNS configuration. Please update the site DNS configuration or contact your administrator if the issue persists.';
						}
					}
				} catch (err) {
					// noop
				}

				ToastActions.toast('error', toastString);

				this.setState({
					messageText: null,
					isSubmitting: false
				});
			}.bind(this));
	},

	handleMouseIn() {
		this.setState({
			hover: true
		});
	},

	handleMouseOut() {
		this.setState({
			hover: false
		});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.Sites.call(this);
	}
});

export default Sites;
