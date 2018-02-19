jest.unmock('../src/scripts/components/SiteGroups');
jest.unmock('../src/scripts/components/SiteGroups/SiteGroupForm.js');
jest.unmock('../src/scripts/components/SiteGroups/render.jsx');
jest.unmock('../src/scripts/components/Overlay/Overlay.js');
jest.unmock('../src/scripts/components/Overlay/render.jsx');
jest.unmock('../src/scripts/components/FormTextInput/render.jsx');
jest.unmock('../src/scripts/components/FormTextInput/FormTextInput.js');
jest.unmock('../src/scripts/components/FormTextArea/render.jsx');
jest.unmock('../src/scripts/components/FormTextArea/FormTextArea.js');

jest.unmock('react-autosuggest');
jest.unmock('react-dom');
jest.unmock('lodash');

describe('SiteGroupForm sut tests', function () {
	let _ = require('lodash');
	let Autosuggest = require('react-autosuggest');

	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let SiteGroupForm = require('../src/scripts/components/SiteGroups/SiteGroupForm')
		.default;
	let SiteActions = require('../src/scripts/actions/SiteActions')
		.default;
	let SiteGroupActions = require('../src/scripts/actions/SiteGroupActions')
		.default;
	let SiteStore = require('../src/scripts/stores/SiteStore')
		.default;
	let SiteSummaryStore = require('../src/scripts/stores/SiteSummaryStore')
		.default;
	let SiteGroupsStore = require('../src/scripts/stores/SiteGroupsStore')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut, element, mockDebounceFunction;

	let formCallback = jest.genMockFunction(), siteGroup = null;

	let testSuggestions = [{
			siteId: '111-121',
			siteName: 'foo.com'
		},
		{
			siteId: '222-121',
			siteName: 'bar.com'
		}];

	let allSiteGroups = [{
		name: 'ChicagoSite123',
		description: 'description of ChicagoSite123',
		siteIds: ['111-121', '111-121'],
		policies: []
        }];

	let siteInformation = [{
			siteId: '111-121',
			siteName: 'foo.com',
			description: 'waka waka waka waka foooooo'
		},
		{
			siteId: '222-121',
			siteName: 'bar.com',
			description: 'waka waka waka waka barrrrrr'
		},
		{
			siteId: '333-333',
			siteName: 'bar.com',
			description: 'waka waka waka waka barrrrrr'
		}];

	let currentEditingItem = {
		name: 'test',
		description: 'This is the test description',
		siteIds: [siteInformation[0], siteInformation[1]],
		policies: []
	};

	let siteGroupItemToBeAdded = {
		name: 'test',
		description: 'This is the test description',
		siteIds: [siteInformation[0].siteId, siteInformation[1].siteId]
	};

	function updateSut(updatedComponent) {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
		sut = ReactTestUtils.renderIntoDocument( updatedComponent );
		element = ReactDOM.findDOMNode(sut);
	}


	let mockResponse = [];
	let createSiteGroupPromise, updateSiteGroupPromise, deleteSiteGroupPromise, getAllSitesSummaryPromise;

	beforeEach(function () {
		createSiteGroupPromise = deferred();
		updateSiteGroupPromise = deferred();
		deleteSiteGroupPromise = deferred();
		getAllSitesSummaryPromise = deferred();

		SiteActions.getSuggestions.mockReturnValue(testSuggestions);

		SiteActions.getAllSitesSummary.mockReturnValue(getAllSitesSummaryPromise.promise);
		SiteGroupActions.createSiteGroup.mockReturnValue(createSiteGroupPromise.promise);
		SiteGroupActions.updateSiteGroup.mockReturnValue(updateSiteGroupPromise.promise);
		SiteGroupActions.deleteSiteGroup.mockReturnValue(deleteSiteGroupPromise.promise);

		SiteGroupsStore.getSiteGroups.mockReturnValue(allSiteGroups);

		_.debounce = jest.genMockFunction();

		mockDebounceFunction = jest.fn(function (inputValue) {
			_.debounce.mock.calls[0][0](inputValue);
		});

		_.debounce.mockReturnValue(mockDebounceFunction);

		siteGroup = {
			siteGroupId:'testSiteGroupId',
			name: '',
			description: '',
			siteIds: ['111-121', '111-212'],
			policies: []
		};

		SiteSummaryStore.getById = jest.fn(function (siteId) {
			if (siteId==='unknownSiteId' || siteId=='resolvableSiteId') {
				return null;
			}
			return {
				siteId: siteId,
				siteName: siteId + '.foobar.com'
			}
		});

		sut = ReactTestUtils.renderIntoDocument( <SiteGroupForm formCallback={formCallback} siteGroup={siteGroup} /> );
		element = ReactDOM.findDOMNode(sut);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('should render', function () {
		expect(element)
			.not.toBeNull();
	});

	it('should render as Overlay', function () {
		expect(element.getAttribute('class')
				.indexOf('Overlay'))
			.toBeGreaterThan(-1);
	});

	it('should have a save button with class="save-btn" ', function () {
		expect(element.querySelector('.save-btn'))
			.not.toBeNull();
	});

	it('should close when close button is clicked class="close-btn" ', function () {
		expect(element.querySelector('.close-btn'))
			.not.toBeNull();

		ReactTestUtils.Simulate.click(element.querySelector('.close-btn'));

		expect(formCallback)
			.toBeCalledWith(['HIDE_FORM']);
	});


	it('should have two text field element', function () {

		expect(element.querySelectorAll('input')
				.length)
			.toBe(2);
	});

	it('should have a textarea element', function () {
		expect(element.querySelector('textarea'))
			.not.toBeNull();
	});

	it('should display label when group name or description is specified', function () {


		expect(element.querySelectorAll('label.SlideInOnShow.show')
				.length)
			.toBe(0);


		// change group name
		var nameElement = element.querySelector('.form-input-name input');
		ReactTestUtils.Simulate.change(nameElement, {
			target: {
				value: 'test'
			}
		});

		// change group description
		var descriptionElement = element.querySelector('.form-input-description textarea');
		ReactTestUtils.Simulate.change(descriptionElement, {
			target: {
				value: 'test description'
			}
		});

		expect(element.querySelectorAll('label.SlideInOnShow.show')
				.length)
			.toBe(2);
	});

	it('should show error message when group name starts with space', function () {

		expect(sut.state.nameValidationMessage)
			.toBeNull();

		sut._validateGroupName(' test space');

		expect(sut.state.nameValidationMessage)
			.toEqual('The site group name cannot start with a space or slash');

		expect(element.querySelector('.group-name.has-error .help-block.hide'))
			.toBeNull();

	});

	it('should show error message when group name starts with slash', function () {

		expect(sut.state.nameValidationMessage)
			.toBeNull();

		sut._validateGroupName('/ test space');

		expect(sut.state.nameValidationMessage)
			.toEqual('The site group name cannot start with a space or slash');

		expect(element.querySelector('.group-name.has-error .help-block.hide'))
			.toBeNull();

	});

	it('should show error of duplication when an already existing group name is specified', function () {

		sut._validateGroupName('ChicagoSite123');

		expect(sut.state.nameValidationMessage)
			.toEqual('This site group name is already in use');

		expect(element.querySelector('.group-name.has-error .help-block.hide'))
			.toBeNull();

	});


	it('should show error message when group name left empty', function () {

		expect(sut.state.nameValidationMessage)
			.toBeNull();

		sut._validateGroupName('');

		expect(sut.state.nameValidationMessage)
			.toEqual('Your site group must have a name');

		expect(element.querySelector('.group-name.has-error .help-block.hide'))
			.toBeNull();

	});

	it('should show empty message when there are no sites in the group', function () {

		siteGroup.sites = [];
		sut.setState({
			siteGroup: siteGroup
		});

		expect(element.querySelector('.empty'))
			.not.toBeNull();
		expect(element.querySelector('.empty')
				.textContent)
			.toContain('This siteGroup is currently empty.');
	});

	it('should show site when group has some sites', function () {

		let siteGroup = sut.state.siteGroup;
		siteGroup.sites = [
			{
				siteId: '1111-1111-11110',
				siteName: 'foo'
			}
        ];

		sut.setState({
			siteGroup: siteGroup
		});


		expect(element.querySelectorAll('.group_sites > div').length).toBe(1);
		expect(element.querySelector('.group_sites > div').textContent)
			.toContain('foo');
	});


	it('should delete site when site is removed from group', function () {

		sut.state.siteGroup.sites = [
			{
				siteId: '1111-1111-11110',
				siteName: 'foo1'
			},
			{
				siteId: '1111-1111-11111',
				siteName: 'foo2'
			}
        ];

		sut.forceUpdate();

		// console.log(element.innerHTML);
		expect(element.querySelectorAll('.group_sites > div')
				.length)
			.toBe(2);

		var siteRemoveIcon = ReactTestUtils.scryRenderedDOMComponentsWithClass(sut, 'remove-site');
		ReactTestUtils.Simulate.click(siteRemoveIcon[0]);

		expect(element.querySelectorAll('.group_sites > div')
				.length)
			.toBe(1);

		expect(sut.state.siteGroup.sites.length)
			.toBe(1);

		expect(element.querySelector('.group_sites > div')
				.textContent)
			.toContain('foo2');
	});


	it('should load suggestions when _handleSuggestionsChange is called', function () {

		var newSuggestions = [
			{
				siteId: '111-121-new',
				siteName: 'foo1.com'
			},
			{
				siteId: '111-122-new',
				siteName: 'foo2.com'
			},
			{
				siteId: '111-123-new',
				siteName: 'foo3.com'
			},
                    ];
		SiteStore.getSuggestions.mockReturnValue(newSuggestions);

		sut._handleSuggestionsChange();

		expect(SiteStore.getSuggestions)
			.toBeCalled();
		expect(sut.state.autoSuggest.suggestions)
			.toEqual(newSuggestions);
		expect(sut.state.isFetching)
			.toBeFalsy();

	});

	it('should load move already added sites to the bottom of the suggestion list', function () {

		var newSuggestions = [
			{
				siteId: '111-121',
				siteName: 'foo1.com'
			},
			{
				siteId: '111-122-new',
				siteName: 'foo2.com'
			},
			{
				siteId: '111-123-new',
				siteName: 'foo3.com'
			},
                    ];
		SiteStore.getSuggestions.mockReturnValue(newSuggestions);

		sut._handleSuggestionsChange();

		expect(SiteStore.getSuggestions)
			.toBeCalled();
		expect(sut.state.autoSuggest.suggestions[sut.state.autoSuggest.suggestions.length - 1])
			.toEqual(newSuggestions[0]);
		expect(sut.state.isFetching)
			.toBeFalsy();

	});

	it('should clear suggestions when onSuggestionsClearRequested is called', function () {

		sut.onSuggestionsClearRequested();

		expect(sut.state.autoSuggest.suggestions.length)
			.toEqual(0);
	});

	it('should add site in the start of list when onSuggestionSelected is called', function () {

		var event = {};
		var localTestSuggestion = {
			siteId: '111-121-new',
			siteName: 'foo1.com'
		};
		var data = {
			suggestion: localTestSuggestion,
			suggestionValue: localTestSuggestion.siteName,
			suggestionIndex: 0,
			sectionIndex: 0,
			method: 'click'
		};

		sut.onSuggestionSelected(event, data);

		expect(sut.state.siteGroup.sites[0])
			.toEqual(localTestSuggestion);
		expect(sut.state.autoSuggest.value)
			.toEqual('');
	});

	it('should scroll to selected site when a site has been added twice, and clear after highlight timer expired', function () {

		let siteId1 = '111-121';
		let siteId2 = '111-212';
		var event = {};
		var localTestSuggestion = {
			siteId: siteId1,
			siteName: 'foo1.com'
		};

		var data = {
			suggestion: localTestSuggestion,
			suggestionValue: localTestSuggestion.siteName,
			suggestionIndex: 0,
			sectionIndex: 0,
			method: 'click'
		};

		let mockReturnValue = {
		 	scrollIntoView : jest.genMockFunction()
		};

		let findDomNodeHold = ReactDOM.findDOMNode;
		ReactDOM.findDOMNode = jest.genMockFunction();
		ReactDOM.findDOMNode.mockReturnValue(mockReturnValue);

		expect(sut.state.highlightedSiteId)
			.toEqual(null);

		sut.onSuggestionSelected(event, data);

		expect(sut.state.highlightedSiteId)
			.toEqual(siteId1);

		localTestSuggestion.siteId = siteId2;

		sut.onSuggestionSelected(event, data);

		expect(sut.state.highlightedSiteId)
			.toEqual(siteId2);

		jest.runOnlyPendingTimers();

		expect(sut.state.highlightedSiteId)
			.toEqual(null);

		ReactDOM.findDOMNode = findDomNodeHold;
	});

	it('should clear all sites /clear is selected', function () {

		var event = {};
		var cmdClear = {
			siteId: 'command-clear',
			siteName: '/clear'
		};
		var data = {
			suggestion: cmdClear,
			suggestionValue: cmdClear.siteName,
			suggestionIndex: 0,
			sectionIndex: 0,
			method: 'click'
		};

		sut.onSuggestionSelected(event, data);

		expect(sut.state.siteGroup.sites.length)
			.toEqual(0);
	});

	it('should call getSuggestions when "foo" is typed ', function () {

		var suggestionInputBox = ReactTestUtils.findRenderedDOMComponentWithClass(sut, 'suggestion-input-box');

		ReactTestUtils.Simulate.change(suggestionInputBox, {
			target: {
				value: 'foo'
			}
		});

		jest.runOnlyPendingTimers();

		expect(sut.state.isFetching)
			.toBeTruthy();
		expect(mockDebounceFunction)
			.toBeCalledWith('foo');
		expect(SiteActions.getSuggestions)
			.toBeCalledWith('foo');

	});

	it('should list /clear command when "/clear" is typed ', function () {

		var suggestionInputBox = ReactTestUtils.findRenderedDOMComponentWithClass(sut, 'suggestion-input-box');

		ReactTestUtils.Simulate.change(suggestionInputBox, {
			target: {
				value: '/clear'
			}
		});

		jest.runOnlyPendingTimers();

		expect(sut.state.autoSuggest.suggestions)
			.toEqual([
				{
					siteName: '/clear - this will remove all sites from this group',
					siteId: 'command-clear',
					description: ''
                        }
                    ]);

	});

	it('should invoke toast action when update site group fails', function () {

		var currentEditingItem = {
				siteGroupId: 'blah',
				name: '',
				description: 'This is the test description',
				siteIds: [testSuggestions[0].siteId, testSuggestions[1].siteId],
				policies: [],
		};

		var getRelevantFields = function (input) {
			return {
				name: input.name.trim(),
				description: input.description,
				siteIds: input.sites.map(function (a) {
					return a.siteId;
				})
			};
		};


		updateSut( <SiteGroupForm formCallback={formCallback} siteGroup={currentEditingItem} /> );

		let updatedSiteGroup = Object.assign(sut.state.siteGroup, {name:'mynewname'});

		sut.setState({
			siteGroup: updatedSiteGroup
		});

		var saveIcon = element.querySelector('.save-btn');
		ReactTestUtils.Simulate.click(saveIcon);

		expect(SiteGroupActions.updateSiteGroup)
				.toBeCalledWith(currentEditingItem.siteGroupId, getRelevantFields(sut.state.siteGroup));

		return updateSiteGroupPromise.rejectThen('fake error', () => {
				expect(ToastActions.toast)
						.toBeCalled();
		});
	});

	it('should invoke deleteSiteGroup site group deleted', function () {

		var trashIcon = element.querySelector('.delete-btn');
		ReactTestUtils.Simulate.click(trashIcon);

		expect(sut.state.isSubmitting)
				.toBeTruthy();

		expect(SiteGroupActions.deleteSiteGroup)
				.toBeCalledWith(siteGroup.siteGroupId);

	});

	it('should invoke toast action when create site group fails', function () {

		updateSut( <SiteGroupForm formCallback = {formCallback}/> );

		let currentEditingItem = {
			name: 'test',
			description: 'This is the test description',
			sites: [siteInformation[0], siteInformation[1]],
			policies: []
		};

		sut.setState({
			siteGroup: currentEditingItem
		});

		var saveIcon = element.querySelector('.save-btn');
		ReactTestUtils.Simulate.click(saveIcon);

		expect(SiteGroupActions.createSiteGroup)
			.toBeCalledWith(siteGroupItemToBeAdded);

		return createSiteGroupPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
		});
	});


	it('should have correct breadcrumb in editing mode', function () {

		var currentEditingItem = {
			name: 'ChicagoSite',
			description: 'This is the test description',
			siteIds: [testSuggestions[0], testSuggestions[1]]
		};

		updateSut( <SiteGroupForm formCallback = {formCallback} siteGroup = {currentEditingItem}/> );

		expect(sut.state.breadcrumb[sut.state.breadcrumb.length - 1].title)
			.toEqual('ChicagoSite');

		expect(sut.state.breadcrumb[sut.state.breadcrumb.length - 2].title)
			.toEqual('Site Groups');

		var nameElement = element.querySelector('.form-input-name input')
		ReactTestUtils.Simulate.change(nameElement, {
			target: {
				value: ''
			}
		});

		expect(sut.state.breadcrumb[sut.state.breadcrumb.length - 1].title)
			.toEqual('Update Site Group');
	});

	it('should show "unsaved changes" and highlight save button when siteGroup is changed ', function () {

		let updatedSiteGroup = Object.assign(sut.state.siteGroup, {'name':'mynewname'});
		sut.setState({
			siteGroup: updatedSiteGroup
		});

		expect(sut.state.hasUnsavedChanges)
			.toBeTruthy();

		expect(element.querySelector('.save-btn.active'))
			.not.toBeNull();
	});

	it('breadcrumb should mimic group name', function () {

		var currentEditingItem = {
			name: 'ChicagoSite',
			description: 'This is the test description',
			siteIds: [testSuggestions[0], testSuggestions[1]]
		};

		updateSut( <SiteGroupForm formCallback={formCallback}/>);
		// Test correct breadcrumb
		expect(sut.state.breadcrumb[sut.state.breadcrumb.length - 1].title)
			.toEqual('New Site Group');

		// Change group name
		var nameElement = element.querySelector('.form-input-name input');
		ReactTestUtils.Simulate.change(nameElement, {
			target: {
				value: 'ChicagoSite'
			}
		});

		// Test correct breadcrumb
		expect(sut.state.breadcrumb[sut.state.breadcrumb.length - 1].title)
			.toBe('ChicagoSite');

		expect(sut.state.breadcrumb[sut.state.breadcrumb.length - 2].title)
			.toEqual('Site Groups');

	});

	it('editing mode show display policies count', function () {

		let updatedSiteGroup = Object.assign(sut.state.siteGroup, {'policies':[
			{ "name": "TreeHuggingPolicy" },
			{ "name": "CatHuggingPolicy"} ] });

		sut.setState({
			siteGroup: updatedSiteGroup
		});

		expect(sut.state.siteGroup.policies.length)
			.toEqual(2);

		expect(element.querySelector('.group-policies-count span')
				.textContent)
			.toEqual("2");
	});

	it('should send correct JSON when adding siteGroup', function () {

		updateSut(<SiteGroupForm formCallback = {formCallback}/>);
		var currentEditingItem = {
			name: 'test',
			description: 'This is the test description',
			sites: [siteInformation[0], siteInformation[1]],
			policies: []
		};

		sut.setState({
			siteGroup: currentEditingItem
		});

		var saveIcon = element.querySelector('.save-btn');
		ReactTestUtils.Simulate.click(saveIcon);

		expect(SiteGroupActions.createSiteGroup)
			.toBeCalledWith(siteGroupItemToBeAdded);
	});

	it('should send correct JSON with name trimmed when adding siteGroup', function () {

		updateSut( <SiteGroupForm formCallback={formCallback}/>);

		var currentEditingItem = {
			name: 'test            ',
			description: 'This is the test description',
			sites: [siteInformation[0], siteInformation[1]],
			policies: []
		};

		sut.setState({
			siteGroup: currentEditingItem
		});

		var saveIcon = element.querySelector('.save-btn');
		ReactTestUtils.Simulate.click(saveIcon);

		expect(SiteGroupActions.createSiteGroup)
			.toBeCalledWith(siteGroupItemToBeAdded);

		return createSiteGroupPromise.resolveThen(mockResponse, () => {
			expect(ToastActions.toast)
				.toBeCalledWith('info', 'Site group ' + siteGroupItemToBeAdded.name.trim() + ' was added successfully');
		});
	});

	it('should show error message when site group description exceeds 256 chars', function () {

		expect(sut.state.descriptionValidationMessage)
			.toBeNull();

		sut._validateGroupDescription('reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeallly loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooonnngggg');

		expect(sut.state.descriptionValidationMessage)
			.toEqual('Description is limited to 256 characters');

		expect(element.querySelector('.group-description.has-error .help-block.hide'))
			.toBeNull();

	});

	it('should remove site from state', function(){
		let site = {
			siteId: siteGroup.siteIds[0]
		};
		expect(sut.state.siteGroup.sites.length).toEqual(2);
		sut.removeSite(site);
		expect(sut.state.siteGroup.sites.length).toEqual(1);

		expect(_.find(sut.state.siteGroup.sites, {'siteId': siteGroup.siteIds[0] })).toBeUndefined();
		expect(_.find(sut.state.siteGroup.sites, {'siteId': siteGroup.siteIds[1] })).not.toBeUndefined();
	});

	it('should attempt obtains latest site information if all siteids cannot be resolved', function() {

		let unresolvedSite = {siteId: 'unknownSiteId'};
		let resolvableSite = {siteId: 'resolvableSiteId', siteName: 'resolvableSiteId.foobar.com' };

		let currentEditingItem = {
			name: 'ChicagoSite',
			description: 'This is the test description',
			siteIds: [testSuggestions[0].siteId,
					  testSuggestions[1].siteId,
					  unresolvedSite.siteId,
				  	  resolvableSite.siteId] };

		expect(SiteActions.getAllSitesSummary).not.toBeCalled();

		updateSut( <SiteGroupForm formCallback={formCallback} siteGroup={currentEditingItem}/> );

		expect(SiteActions.getAllSitesSummary).toBeCalled();

		expect(sut.state.isLoading).toBeTruthy();

		SiteSummaryStore.getById = jest.fn(function (siteId) {
			if (siteId==='unknownSiteId' ) {
				return null;
			}
			return { siteId: siteId,
					 siteName: siteId + '.foobar.com' }
		});

		console.log(sut.state.siteGroup.sites );

		return getAllSitesSummaryPromise.resolveThen(mockResponse, () => {
			expect(sut.state.isLoading).toBeFalsy();
			console.log(sut.state.siteGroup.sites );
			expect(_.find(sut.state.siteGroup.sites, unresolvedSite)).toEqual(unresolvedSite);
			expect(_.find(sut.state.siteGroup.sites, resolvableSite)).toEqual(resolvableSite);
		});
	});

});
