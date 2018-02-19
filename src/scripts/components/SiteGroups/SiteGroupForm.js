/**
 * SiteGroups Add Component
 */

import render from './render.jsx';
import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
var {
	PropTypes
} = React; // eslint-disable-line no-unused-vars

import SiteActions from '../../actions/SiteActions';
import SiteGroupActions from '../../actions/SiteGroupActions';
import ToastActions from '../../actions/ToastActions';
import SiteStore from '../../stores/SiteStore';
import SiteSummaryStore from '../../stores/SiteSummaryStore';
import SiteGroupsStore from '../../stores/SiteGroupsStore';
import _ from 'lodash';

import LogManager from '../../logger/logger'

const LOGGER = LogManager.getLogger('SiteGroupForm');

/**
 * SiteGroups Component
 */
var SiteGroupForm = React.createClass({

	timerHighlightSite: null,

	/** Property Types */
	propTypes: {
		formCallback: PropTypes.func.isRequired,
		siteGroup: PropTypes.object
	},

	/** Get initial state */
	getInitialState: function () {
		LOGGER.logDebug('SiteGroupForm', 'getInitialState - site group form initiated');
		this.lastRequestTimeoutId = null;
		LOGGER.logDebug('getInitialState - site group form initiated');

		return {
			// I'm not a fan of this.
			siteGroup: {
				name: '',
				description: '',
				sites: [],
				policies: [],
				siteGroupId: ''
			},
			highlightedSiteId: null,
			originalSiteGroup: null,
			nameValidationMessage: null,
			descriptionValidationMessage: null,
			hasUnsavedChanges: false,
			breadcrumb: [],
			zIndexClass: '2',
			isSubmitting: false,
			isLoading: false,
			isEditing: false,
			isForm: true,
			enteredSite: null,
			showAvailableSites: false,
			highlightedSite: null,
			autoSuggest: {
				noSuggestions: false,
				onlySitesInSiteGroup: false,
				value: '',
				suggestions: []
			}
		};
	},

	_clearSiteHighlightTimer: function () {
		if (this.timerHighlightSite) {
			clearTimeout(this.timerHighlightSite);
		}
	},

	_resolveSites: function (siteIds, fallback) {
		var sites = [];
		for (let i = 0; i < this.props.siteGroup.siteIds.length; i++) {
			let site = SiteSummaryStore.getById(this.props.siteGroup.siteIds[i]);
			if (site === null) {
				if (fallback) {
					sites.push(fallback(this.props.siteGroup.siteIds[i]));
				}
			} else {
				sites.push(site);
			}
		}
		return sites;
	},

	componentWillMount: function () {
		this.allSiteGroups = SiteGroupsStore.getSiteGroups();

		// Setup for sitegroup edit
		if (this.props.siteGroup) {

			let siteGroup = {
				siteGroupId: this.props.siteGroup.siteGroupId,
				name: this.props.siteGroup.name,
				description: this.props.siteGroup.description,
				policies: this.props.siteGroup.hasOwnProperty('policies') ? this.props.siteGroup.policies : [],
				sites: []
			};

			// Attempt to resolve siteids to sites using existing site
			// information
			let sites = this._resolveSites(this.props.siteGroup.siteIds);

			// If all site ids in sitegroup cannot be resolved to known sites, attempt to
			// refresh the site summary store and re-resolve
			if (sites.length != this.props.siteGroup.siteIds.length) {

				LOGGER.logInfo("Refreshing sites. Unable to resolve all sites in sitegroup.  NumSitesInGroup: %d ResolvedSites: %d",
					this.props.siteGroup.siteIds.length, sites.length);

				this.setState({
					siteGroup: siteGroup,
					isEditing: true,
					isLoading: true,
				});

				// Just use the trigger of the request completion to re-resolve the sites
				SiteActions.getAllSitesSummary()
					.then(() => {

						LOGGER.logInfo("Site resfresh complete.");

						// After sites have again been retrieved attempt to resolve the sites again
						// with a fallback in case the siteId still cannot be resolved
						let sites = this._resolveSites(this.props.siteGroup.siteIds, function (siteId) {
							LOGGER.logError("Unable to resolve site: %s", siteId);
							return {
								siteId: siteId
							};
						});

						siteGroup.sites = sites;

						this.setState({
							originalSiteGroup: _.cloneDeep(siteGroup),
							siteGroup: siteGroup,
							isLoading: false,
						});
					});
			} else {
				siteGroup.sites = sites;
				this.setState({
					originalSiteGroup: _.cloneDeep(siteGroup),
					siteGroup: siteGroup,
					isEditing: true,
				});
			}
		} else {
			this.setState({
				originalSiteGroup: _.cloneDeep(this.state.siteGroup),
			});
		}

		this.debouncedGetSuggestions = _.debounce(function (inputValue) {
			SiteActions.getSuggestions(inputValue);
		}, 150, {
			'maxWait': 500
		});
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		this.setState({
			breadcrumb: this._getBreadcrumb()
		});
		SiteStore.addSuggestionsChangeListener(this._handleSuggestionsChange);
	},

	/** Fires when component will render with updated state */
	componentWillUpdate: function (nextProps, nextState) {
		if (!this.state.isLoading && this.state.originalSiteGroup && !_.isEqual(this.state.originalSiteGroup, nextState.siteGroup)) {
			nextState.hasUnsavedChanges = true;
		} else {
			nextState.hasUnsavedChanges = false;
		}
	},

	/** Fires before component is unmounted */
	componentWillUnmount: function () {
		this._clearSiteHighlightTimer();
		SiteStore.removeSuggestionsChangeListener(this._handleSuggestionsChange);
	},

	/**
	 * Triggers when name of sitegroup is changed
	 * @param  event {Event} Typing event
	 */
	_handleSiteGroupNameChange: function (e) {

		let siteGroup = this.state.siteGroup;
		let breadcrumb = this.state.breadcrumb;

		siteGroup.name = e.target.value;

		let isNameValid = this._validateGroupName(siteGroup.name);

		if (siteGroup.name === '') {
			let defaultBreadcrumb = this._getBreadcrumb();
			breadcrumb[breadcrumb.length - 1].title = defaultBreadcrumb[defaultBreadcrumb.length - 1].title;
		} else {
			if (isNameValid) {
				breadcrumb[breadcrumb.length - 1].title = siteGroup.name;
			}
		}

		this.setState({
			siteGroup: siteGroup,
			breadcrumb: breadcrumb
		});
	},

	/**
	 * Validates name of site group
	 * @param  siteGroupName {String}    Name of the site group
	 * @return {bool}           Returns true/false
	 */
	_validateGroupName: function (siteGroupName) {

		// Validate space in group name
		if ((siteGroupName.charAt(0) == ' ') || (siteGroupName.charAt(0) == '/')) {
			this.setState({
				nameValidationMessage: 'The site group name cannot start with a space or slash'
			});
			return false;
		}

		// Do not allow empty group name
		if (siteGroupName === '') {
			this.setState({
				nameValidationMessage: 'Your site group must have a name'
			});
			return false;
		}

		// let allSiteGroups = SiteGroupsStore.getSiteGroups();
		let matchedSiteGroups = _.filter(this.allSiteGroups, {
			'name': siteGroupName
		});

		// Make sure group with the same do not exists.
		if (matchedSiteGroups.length > 0) {
			if ((!this.state.isEditing) ||
				(this.state.isEditing && siteGroupName != this.props.siteGroup.name)) {

				this.setState({
					nameValidationMessage: 'This site group name is already in use'
				});
				return false;
			}
		}

		this.setState({
			nameValidationMessage: null
		});

		return true;
	},

	/**
	 * Validates description of site group
	 * @return {bool}           Returns true/false
	 */
	_validateGroupDescription: function (siteGroupDescription) {

		// Validate space in group name
		if (siteGroupDescription.length >= 256) {
			this.setState({
				descriptionValidationMessage: 'Description is limited to 256 characters'
			});
			return false;
		}

		this.setState({
			descriptionValidationMessage: null
		});

		return true;
	},

	/**
	 * Triggers when description of sitegroup is changed
	 * @param  event {Event}    Typing event
	 */
	_handleSiteGroupDescriptionChange: function (e) {
		let siteGroup = this.state.siteGroup;
		siteGroup.description = e.target.value;

		this._validateGroupDescription(siteGroup.description);

		this.setState({
			siteGroup: siteGroup
		});
	},

	/**
	 * Triggers when suggestion input box value is changed
	 * @param  event {Event}             Event object
	 * @param  options.newValue {String} New value of the input box
	 */
	_handleSuggestInputChange: function (event, {
		newValue
	}) {
		let autoSuggest = this.state.autoSuggest;
		autoSuggest.value = newValue;
		this.setState({
			autoSuggest: autoSuggest
		});
	},

	/**
	 * Triggers when suggestions changes in SiteStore
	 */
	_handleSuggestionsChange: function () {

		let suggestions = SiteStore.getSuggestions();
		let autoSuggest = this.state.autoSuggest;
		let siteGroup = this.state.siteGroup;

		var usedSiteIds = [].concat.apply([], _.map(this.allSiteGroups, 'siteIds'));

		for (var i = suggestions.length - 1; i >= 0; i--) {
			let siteId = suggestions[i].siteId;

			if (usedSiteIds.indexOf(siteId) !== -1) {
				suggestions[i].description = 'unavailable';
			} else if (_.find(siteGroup.sites, {
					'siteId': siteId
				})) {
				suggestions[i].description = 'group member';
			} else {
				suggestions[i].description = '';
			}
		}

		// sort by description to move existing site to botom of suggestion list.
		suggestions = _.sortBy(suggestions, ['description']);

		autoSuggest.noSuggestions = suggestions.length === 0 ? true : false;
		autoSuggest.suggestions = suggestions;
		autoSuggest.onlySitesInSiteGroup = _.filter(suggestions, {
				'description': 'unavailable'
			})
			.length === suggestions.length ? true : false;

		autoSuggest.suggestions = suggestions;

		if (autoSuggest.onlySitesInSiteGroup) {
			autoSuggest.suggestions = [];
		}

		this.setState({
			isFetching: false,
			autoSuggest: autoSuggest
		});
	},

	/**
	 * Default breadcrumbs for new or updated site groups
	 * @return {Array} An array of objects containing title property
	 */
	_getBreadcrumb: function () {
		if (this.state.isEditing) {
			let title = this.state.siteGroup.name === '' ? 'Update Site Group' : this.state.siteGroup.name;
			return [{
				title: 'Site Groups'
				}, {
				title: title
			}];
		} else {
			return [
				{
					title: 'Site Groups'
			},
				{
					title: 'New Site Group'
			}];
		}
	},

	/**
	 * Autosuggest will call this function every time you need to update suggestions.
	 * @param  options.value {String}  Input string of user
	 */
	onSuggestionsFetchRequested: function ({
		value
	}) {

		let inputValue = value.trim();
		let autoSuggest = this.state.autoSuggest;

		LOGGER.logInfo('onSuggestionsFetchRequested - called');

		if (inputValue.startsWith('/')) {
			autoSuggest.suggestions = [
				{
					siteName: '/clear - this will remove all sites from this group',
					siteId: 'command-clear',
					description: ''
                  }
              ];
			autoSuggest.noSuggestions = false;

			this.setState({
				autoSuggest: autoSuggest
			});
		} else {
			// Do not fetch suggestions until a character is typed
			if (inputValue.length === 0)
				return;

			autoSuggest.noSuggestions = false;
			this.setState({
				isFetching: true,
				autoSuggest: autoSuggest
			});

			this.debouncedGetSuggestions(inputValue);
		}

	},

	/**
	 * Autosuggest will call this function every time you need to clear suggestions.
	 */
	onSuggestionsClearRequested: function () {
		let autoSuggest = this.state.autoSuggest;

		autoSuggest.suggestions = [];

		this.setState({
			autoSuggest: autoSuggest
		});

		LOGGER.logDebug('SiteGroupForm', 'onSuggestionsClearRequested - suggestions cleared');
	},



	/**
	 * Triggers when a suggestion is selected by user
	 * @param  event {Event}                    Event object
	 * @param  options.suggestion {Site}        Site/suggestion selected by user
	 * @param  options.suggestionValue {String} Value field of the suggestion
	 * @param  options.suggestionIndex {Number} Index number of suggestion
	 * @param  options.sectionIndex    {Number} Index of the section (not being used)
	 * @param  options.method {String}          Method being used
	 */
	onSuggestionSelected: function (event, {
		suggestion,
		suggestionValue,
		suggestionIndex,
		sectionIndex,
		method
	}) {

		let siteGroup = this.state.siteGroup;
		let autoSuggest = this.state.autoSuggest;
		var usedSiteIds = [].concat.apply([], _.map(this.allSiteGroups, 'siteIds'));

		// Run clear command
		if (suggestion.siteId == 'command-clear') {
			siteGroup.sites = [];
			LOGGER.logDebug('onSuggestionSelected - ran /clear command - deleted all sites from group');
		} else if (suggestion.hasOwnProperty('siteId')) {
			// If selected site is new one
			if (!_.find(siteGroup.sites, {
					'siteId': suggestion.siteId
				})) {
				siteGroup.sites.unshift(suggestion);
				LOGGER.logDebug('onSuggestionSelected - site added to site group');
			} else {

				this.setState({
					highlightedSiteId: suggestion.siteId
				});

				this._clearSiteHighlightTimer();

				this.timerHighlightSite = setTimeout(function () {
					this.setState({
						highlightedSiteId: null
					});
					this.timerHighlightSite = null;
				}.bind(this), 1000);

				let node = ReactDOM.findDOMNode(document.getElementById(suggestion.siteId));
				node.scrollIntoView({
					behavior: 'smooth'
				});

				LOGGER.logDebug('onSuggestionSelected - scroll to ' + suggestion.siteName);
			}
		}

		autoSuggest.value = '';
		this.setState({
			siteGroup: siteGroup,
			autoSuggest: autoSuggest
		});
	},

	_closeHandler: function () {
		this.props.formCallback(['HIDE_FORM']);
	},

	_saveHandler: function () {

		if (!this._validateGroupName(this.state.siteGroup.name) ||
			!this._validateGroupDescription(this.state.siteGroup.description)) {
			return false;
		}

		this.setState({
			isSubmitting: true
		});

		var getRelevantFields = function (input) {
			return {
				name: input.name.trim(),
				description: input.description,
				siteIds: input.sites.map(function (a) {
					return a.siteId;
				})
			};
		};


		if (!this.state.isEditing) {
			// Add site group
			SiteGroupActions.createSiteGroup(getRelevantFields(this.state.siteGroup))
				.then(() => {
					LOGGER.logInfo('_saveHandler create site group succeeded.');
					this.setState({
						isSubmitting: false
					});

					this.props.formCallback(['HIDE_FORM', 'REFRESH']);

					ToastActions.toast('info', 'Site group ' + this.state.siteGroup.name.trim() + ' was added successfully');
					// SiteGroupActions.getAll();
					// this.setState({ DisplaySiteGroupForm: false, numDataAdded: 0, isFetchingNextDataPage: true, isSubmitting: false });
				})
				.catch(function (jqXHR, textStatus, errorThrown) {
					LOGGER.logError('_saveHandler create site group failed.');
					var toastString = 'Failed to create site group. Please refresh to try again or contact your administrator if the issue persists.';

					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							if (responseObject.hasOwnProperty('code') && responseObject.code !== '') {
								toastString = 'Failed to update site, following error occured "' + responseObject.brief + '"';
							}

						}
					} catch (err) {
						LOGGER.logError('Error when adding site group.');
					}
					this.setState({
						isSubmitting: false
					});
					ToastActions.toast('error', toastString);

				}.bind(this));


		} else { // Update sitegroup

			SiteGroupActions.updateSiteGroup(this.state.siteGroup.siteGroupId, getRelevantFields(this.state.siteGroup))
				.then(() => {
					this.setState({
						isSubmitting: false
					});
					this.props.formCallback(['HIDE_FORM', 'REFRESH']);

					ToastActions.toast('info', 'Site group ' + this.state.siteGroup.name.trim() + ' was updated successfully');
					LOGGER.logInfo('_saveHandler update site group succeeded.');
				})
				.catch(function (jqXHR, textStatus, errorThrown) {
					LOGGER.logError('_saveHandler update site group failed.' + textStatus + " Error Thrown: " + errorThrown + " " + jqXHR);
					var toastString = 'Failed to update site group. Please refresh to try again or contact your administrator if the issue persists.';

					try {
						if (jqXHR && jqXHR.responseText) {
							var responseObject = JSON.parse(jqXHR.responseText);
							if (responseObject.hasOwnProperty('code') && responseObject.code !== '') {
								toastString = 'Failed to update site group, following error occured "' + responseObject.brief + '"';
							}

						}
					} catch (err) {
						LOGGER.loginfo('Error when adding site group.');
					}

					ToastActions.toast('error', toastString);
					this.setState({
						isSubmitting: false
					});
				}.bind(this));

		}
	},

	_deleteSiteGroup: function () {
		this.setState({
			isSubmitting: true
		});

		SiteGroupActions.deleteSiteGroup(this.state.siteGroup.siteGroupId)
			.then(() => {
				ToastActions.toast('info', 'Site Group: ' + this.state.siteGroup.name + ' has been deleted');
				LOGGER.logInfo('_deleteSiteGroup delete site group succeeded.');
				this.setState({
					isSubmitting: false
				});
				this.props.formCallback(['HIDE_FORM']);
			})
			.catch(function (jqXHR, textStatus, errorThrown) {
				LOGGER.logError('_deleteSiteGroup delete site group failed.');
				var toastString = 'Failed to delete site group. Please refresh to try again or contact your administrator if the issue persists.';

				try {
					if (jqXHR && jqXHR.responseText) {
						var responseObject = JSON.parse(jqXHR.responseText);
						if (responseObject.hasOwnProperty('code') && responseObject.code != '') {
							toastString = 'Failed to delete site group, following error occured "' + responseObject.brief + '"';
						}

					}
				} catch (err) {
					LOGGER.loginfo('Error when adding site group.');
				}

				this.setState({
					isSubmitting: false
				});
				ToastActions.toast('error', toastString);
			}.bind(this));
	},

	/**
	 * Remove site from the site group
	 * @param  site {Site} Site to be removed
	 */
	removeSite: function (site) {
		let siteGroup = this.state.siteGroup;

		// Find and remove the selected site from current site group object
		_.remove(siteGroup.sites, function (currentSite) {
			return currentSite.siteId == site.siteId;
		});

		this.setState({
			siteGroup: siteGroup
		});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return render.SiteGroupForm.call(this);
	}

});

export default SiteGroupForm;
