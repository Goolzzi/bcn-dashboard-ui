jest.unmock('../src/scripts/components/Sites/Sites');
jest.unmock('../src/scripts/components/Sites/render.jsx');
jest.unmock('../src/scripts/components/EditableTable/EditableTable');
jest.unmock('../src/scripts/components/EditableTable/render.jsx');
jest.unmock('../src/scripts/components/Spinner/Spinner');
jest.unmock('../src/scripts/components/Spinner/render.jsx');
jest.unmock('../__testutils__/googleutils');
jest.unmock('moment');
jest.unmock('lodash');
jest.unmock('../src/scripts/components/Overlay/Overlay');
jest.unmock('../src/scripts/components/Overlay/render.jsx');

import {
	mount
} from 'enzyme';
import Overlay from '../src/scripts/components/Overlay/Overlay';

describe('Sites Component', function () {
	let Sites = require('../src/scripts/components/Sites/Sites')
		.default;
	let SiteStore = require('../src/scripts/stores/SiteStore')
		.default;
	let SiteService = require('../src/scripts/services/SiteService')
		.default;
	let SiteImageDownloadStore = require('../src/scripts/stores/SiteImageDownloadStore')
		.default;
	let SiteImageDownloadActions = require('../src/scripts/actions/SiteImageDownloadActions')
		.default;
	let SiteActions = require('../src/scripts/actions/SiteActions')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let googleUtils = require('../__testutils__/googleutils');
	let Simulate = ReactTestUtils.Simulate;
	let SettingsService = require('../src/scripts/services/SettingsService')
		.default;
	let deferred = require('../__testutils__/deferred')
		.default;


	window.google = googleUtils.mockGoogle;

	var createImageInfo = (status, link, timeToExpiry) => {
		if (status !== 'COMPLETED') {
			return {
				'status': status
			}
		} else {
			return {
				'status': status,
				'link': link,
				'timeToExpiry': timeToExpiry
			};
		}
	};

	var createSite = (siteName, siteId, lat, lng, imageInfo) => {
		return {
			'siteName': siteName,
			'siteId': siteId,
			'location': {
				'lat': lat,
				'lng': lng
			},
			'dnsSettings': {
				'settings': {
					servers: [{
						ipAddress: '8.8.8.8'
					}]
				},
				'source': "GLOBAL"
			},
			'image': imageInfo
		}
	};

	let testSites = [createSite('siteA', 'siteAId', '1.0', '1.0', createImageInfo('NOT_FOUND')),
                     createSite('siteB', 'siteBId', '2.0', '1.0', createImageInfo('NOT_FOUND')),
                     createSite('siteC', 'siteCId', '3.0', '1.0', createImageInfo('IN_PROGRESS')),
                     createSite('siteD', 'siteDId', '4.0', '1.0', createImageInfo('FAILED')),
                     createSite('siteE', 'siteEId', '5.0', '1.0', createImageInfo('COMPLETED', 'http://www.myimage.com/spImage.tar', 12 * 60 * 60)),
                     createSite('siteF', 'siteFId', '5.0', '1.0', createImageInfo('IN_PROGRESS'))];

	var createSitePromise;

	var getSettingsPromise;

	var getFactorySettingsPromise;

	var sut, nodeComponent, closeButtonNode, tableNode;

  //This is a little funky because we're rendering sites in two different ways.
	var emitSiteStoreChange = (index) => {
		SiteStore.addChangeListener.mock.calls[index===undefined?0:index][0]();
	}

	beforeEach(function () {
		createSitePromise = deferred();
		SiteActions.createSite.mockReturnValue(createSitePromise.promise);

		getSettingsPromise = deferred();

		getFactorySettingsPromise = deferred();

		SiteImageDownloadActions.requestSiteImage.mockClear();
		ToastActions.toast.mockClear();

		SiteImageDownloadStore.get.mockReturnValue({});

		SettingsService.getFactorySettings.mockReturnValue(getFactorySettingsPromise.promise);

		SettingsService.getSettings.mockReturnValue(getSettingsPromise.promise);
		SiteStore.get.mockReturnValue(null);

		sut = ReactTestUtils.renderIntoDocument( <Sites /> );
		sut._handleSitesChange();
		nodeComponent = ReactDOM.findDOMNode(sut);
		tableNode = nodeComponent.querySelector('div[class~="table-body"]');
	});

	var getTableRows = () => {
		return tableNode.querySelectorAll('div[class~="table-body"] tr');
	};

	var getTableElement = (row, col) => {
		return getTableRows()[row].querySelectorAll('td')[col];
	};

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(nodeComponent)
			.parentNode);
	});

	it('should close when close button is clicked', function () {
			const wrapper = mount( <Sites /> );
			emitSiteStoreChange(1);

			expect(wrapper.find(Overlay)
					.prop('isShown'))
				.toBeTruthy();

			const closeHandler = wrapper.find(Overlay)
				.prop('closeHandler');

			closeHandler();

			expect(SiteActions.close)
				.toBeCalled();
	});

	it('when sites store changes, state of sites component should contain updated sites sorted by sitename', function () {
		var sites = null;
		SiteStore.get = jest.fn(() => sites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual([]);
		sites = [testSites[5], testSites[0], testSites[3], testSites[1]];
		SiteStore.get = jest.fn(() => sites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual([testSites[0], testSites[1], testSites[3], testSites[5]]);
	});

	it('when getLatLng is called then google API should be called', function () {
		var testText = '39 Washington Ave, Oakville, ON';
		sut._getLatLng(testText);
		expect(sut.geocoder.geocode)
			.toBeCalled();
	});

	it('when _handleOnClear is called then state changes', function () {
		sut.state.newData = {
			name: '1',
			location: '2',
			forwardingDNS: '3'
		};
		sut._handleOnClear();
		expect(sut.state.newData)
			.toEqual({
				name: '',
				location: '',
				forwardingDNS: ''
			});
	});

	it('when _getDefaultDNSSetting is called and settings service returns a failure then state changes and toast is thrown', function () {
		sut._getDefaultDNSSetting();
		return getSettingsPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
			expect(sut.state.default_DNS_Setting)
				.toEqual('(failed to load default DNS)');
		});
	});

	it('when _getDefaultDNSSetting is called and settingsfactory service returns a failure then state changes and toast is thrown', function () {
		sut._getDefaultDNSSetting();
		return getSettingsPromise.resolveThen({
			servers: [{}]
		}, () => {
			return getFactorySettingsPromise.rejectThen('fake error', () => {
				expect(ToastActions.toast)
					.toBeCalled();
				expect(sut.state.default_DNS_Setting)
					.toEqual('(failed to load default DNS)');
			});
		});
	});


	it('when _getDefaultDNSSetting is called and settings service returns a settiing then it is saved in state', function () {
		sut._getDefaultDNSSetting();
		return getSettingsPromise.resolveThen({
			servers: [{
				ipAddress: '123'
			}]
		}, () => {
			expect(sut.state.default_DNS_Setting)
				.toEqual('123');
			expect(sut.sitesTableMetadata.filter(function (obj) {
					return obj.inputName == 'forwardingDNS'
				})[0].placeholder)
				.toEqual('123');
		});
	});

	it('when _getDefaultDNSSetting is called and settings service doesnt but the factory settings does returns a settiing then it is saved in state', function () {
		sut._getDefaultDNSSetting();
		return getSettingsPromise.resolveThen({
			servers: [{}]
		}, () => {
			return getFactorySettingsPromise.resolveThen({
				servers: [{
					ipAddress: '123'
				}]
			}, () => {
				expect(sut.state.default_DNS_Setting)
					.toEqual('123');
			});
		});
	});

	it('when _getDefaultDNSSetting is called and settings service doesnt even return a server but the factory settings does returns a settiing then it is saved in state', function () {

		sut._getDefaultDNSSetting();
		return getSettingsPromise.resolveThen({
			servers: [{
				ipAddress: ''
			}]
		}, () => {
			return getFactorySettingsPromise.resolveThen({
				servers: [{
					ipAddress: '124'
				}]
			}, () => {
				expect(sut.state.default_DNS_Setting)
					.toEqual('124');
			});
		});
	});

	it('when _handleOnChange is called then state changes', function () {
		sut.state.newData = {
			name: '1',
			location: '2',
			forwardingDNS: '3'
		};
		sut._handleOnChange('name', '4');
		sut._handleOnChange('location', '5');
		sut._handleOnChange('forwardingDNS', '6');
		expect(sut.state.newData)
			.toEqual({
				name: '4',
				location: '5',
				forwardingDNS: '6'
			});
	});

	it('should fail site validation when no site name is provided', function () {

		sut.state.newData = {
			name: '',
			location: '',
			forwardingDNS: ''
		};

		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Enter a name for this site.');
	});

	it('should fail site validation when invalid site name starting with slash is provided', function () {

		sut.state.newData = {
			name: '/add',
			location: '',
			forwardingDNS: ''
		};

		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Name cannot start with a slash');
	});

	it('should fail site validation when invalid site name is provided', function () {

		sut.state.newData = {
			name: 'aaa /add',
			location: '',
			forwardingDNS: ''
		};

		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Name cannot contain a space followed by a slash');
	});

	it('should fail site validation when duplicate site name is provided', function () {

		sut.state.newData = {
			name: 'siteB',
			location: '13 Main Str, Toronto, ON',
			forwardingDNS: ''
		};

		sut.state.sites = [testSites[0], testSites[1], testSites[3], testSites[5]];
		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Site name already exists.');
	});

	it('should fail site validation when no location is provided', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: '',
			forwardingDNS: ''
		};

		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Specify a location for this site.');
	});

	it('should fail site validation when invalid forwarding DNS is provided', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: '',
			forwardingDNS: '888.8.8.8'
		};

		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Please enter a valid IP address.');
	});

	it('should pass site validation when proper location and site name are provided', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: '13 Main Str, Toronto, ON',
			forwardingDNS: ''
		};

		var mockResults = [
			{
				geometry: {
					location: {
						lng: 12.1122,
						lat: 23.133
					}
				}
            }
        ];

		var geoCoder = googleUtils.mockGoogle.maps.Geocoder();
		geoCoder.geocode.mockClear();

		sut._validateNewSiteData();

		var expectedObject = {
			settings: {
				servers: [{
					ipAddress: ''
          }]
			},
			location: {
				'lng': 12.1122,
				'lat': 23.133
			}
		};
		expectedObject.siteName = 'Toronto';


		geoCoder.geocode.mock.calls[0][1](mockResults, 'OK');

		expect(SiteActions.createSite)
			.toBeCalledWith(expectedObject);
		expect(sut.state.messageText)
			.toBe(null);
		expect(sut.state.isSubmitting)
			.toBe(true);

		return createSitePromise.resolve(undefined, () => {
			expect(sut.state.isSubmitting)
				.toBe(false);
		});
	});

	it('should pass site validation when proper location, setting, and site name are provided', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: '13 Main Str, Toronto, ON',
			forwardingDNS: '123.123.123.123'
		};

		var mockResults = [
			{
				geometry: {
					location: {
						lng: 12.1122,
						lat: 23.133
					}
				}
            }
        ];

		var geoCoder = googleUtils.mockGoogle.maps.Geocoder();
		geoCoder.geocode.mockClear();

		sut._validateNewSiteData();

		geoCoder.geocode.mock.calls[0][1](mockResults, 'OK');
		var expectedObject = {
			location: {
				'lng': 12.1122,
				'lat': 23.133
			},
			settings: {
				servers: [{
					ipAddress: '123.123.123.123'
            }]
			}
		};
		expectedObject.siteName = 'Toronto';

		expect(SiteActions.createSite)
			.toBeCalledWith(expectedObject);
		expect(sut.state.messageText)
			.toBe(null);
		expect(sut.state.isSubmitting)
			.toBe(true);

		return createSitePromise.resolveThen(undefined, () => {
			expect(sut.state.isSubmitting)
				.toBe(false);
		});
	});

	it('should invoke toast action when create site fails', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: '13 Main Str, Toronto, ON',
			forwardingDNS: ''
		};

		var mockResults = [
			{
				geometry: {
					location: {
						lng: 12.1122,
						lat: 23.133
					}
				}
            }
        ];

		var geoCoder = googleUtils.mockGoogle.maps.Geocoder();
		geoCoder.geocode.mockClear();

		sut._validateNewSiteData();

		geoCoder.geocode.mock.calls[0][1](mockResults, 'OK');
		expect(sut.state.messageText)
			.toBe(null);
		expect(sut.state.isSubmitting)
			.toBe(true);

		return createSitePromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
		});
	});

	it('should fail site validation when proper location is provided and google API return error', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: '13 Main Str, Toronto, ON',
			forwardingDNS: ''
		};

		var mockResults = [];

		var geoCoder = googleUtils.mockGoogle.maps.Geocoder();
		geoCoder.geocode.mockClear();

		sut._validateNewSiteData();

		geoCoder.geocode.mock.calls[0][1](mockResults, 'REQUEST_DENIED');

		expect(sut.state.messageText)
			.toContain('Could not contact Geolocation service.');
	});

	it('should fail site validation when location yeilds zero results', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: 'alalalalalalalalalaala',
			forwardingDNS: ''
		};
		var mockResults = [];

		var geoCoder = googleUtils.mockGoogle.maps.Geocoder();
		geoCoder.geocode.mockClear();

		sut._validateNewSiteData();

		geoCoder.geocode.mock.calls[0][1](mockResults, 'ZERO_RESULTS');

		//console.log("messageText contains: " +sut.state.messageText);

		expect(sut.state.messageText)
			.toContain('Could not validate location.');
	});

	it('should fail site validation when location yeilds more than one result', function () {

		sut.state.newData = {
			name: 'Toronto',
			location: 'Toronto',
			forwardingDNS: ''
		};

		var mockResults = [
			{
				geometry: {
					location: {
						lng: 12.1122,
						lat: 23.133
					}
				}
			},
			{
				geometry: {
					location: {
						lng: 33.1122,
						lat: 73.888
					}
				}
			},
        ];

		var geoCoder = googleUtils.mockGoogle.maps.Geocoder();
		geoCoder.geocode.mockClear();

		sut._validateNewSiteData();

		geoCoder.geocode.mock.calls[0][1](mockResults, 'OK');

		expect(sut.state.messageText)
			.toContain('This address has multiple matches.');

	});

	it('should fail site validation when geocoder is not available', function () {

		sut.state.newData = {
			name: 'no geocoder',
			location: 'Toronto',
			forwardingDNS: ''
		};

		sut.geocoder = null;
		window.google.maps.Geocoder = jest.fn(() => null);

		sut._validateNewSiteData();

		expect(sut.state.messageText)
			.toContain('Could not contact Geolocation service');
	});

	it('should start refresh timer when component mounted', function () {
		expect(setInterval.mock.calls.length)
			.toBe(1);
		expect(setInterval.mock.calls[0][1])
			.toBe(30000);
		SiteActions.getAllSites.mockReturnValue(deferred()
			.promise);
		jest.runOnlyPendingTimers();
		expect(SiteActions.getAllSites)
			.toBeCalled();
	});

	/*
	THE NEXT TWO TESTS ARE TEMPORARY UNTIL WE FIX SITES MOUNTING BEHAVIOR
	it('should stop refresh timer when component unmounted', function () {
		const wrapper = mount( <Sites /> );
		expect(clearTimeout.mock.calls.length)
			.toBe(0);
		SiteStore.getIsShown.mockClear();
		SiteStore.getIsShown.mockReturnValue(false);
		emitSiteStoreChange(1);
		expect(clearInterval.mock.calls.length)
			.toBe(1);
	});

	it('should stop refresh timer when component unmounted after timer has been called', function () {
		const wrapper = mount( <Sites /> );
		emitSiteStoreChange(1);
		expect(clearTimeout.mock.calls.length)
			.toBe(0);
		SiteStore.getIsShown.mockClear();
		SiteStore.getIsShown.mockReturnValue(false);
		emitSiteStoreChange(1);

		expect(clearInterval.mock.calls.length)
			.toBe(1);
	});
*/

	it('should stop refresh timer when component unmounted', function () {
		expect(clearTimeout.mock.calls.length)
			.toBe(0);

		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(nodeComponent)
			.parentNode);
		expect(clearInterval.mock.calls.length)
			.toBe(1);

		//Make the after step happy
		sut = ReactTestUtils.renderIntoDocument( < Sites /> );
		nodeComponent = ReactDOM.findDOMNode(sut);
	});

	it('should stop refresh timer when component unmounted after timer has been called', function () {
		expect(clearTimeout.mock.calls.length)
			.toBe(0);

		jest.runOnlyPendingTimers();

		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(nodeComponent)
			.parentNode);
		expect(clearInterval.mock.calls.length)
			.toBe(1);

		//Make the after step happy
		sut = ReactTestUtils.renderIntoDocument( < Sites /> );
		nodeComponent = ReactDOM.findDOMNode(sut);
	});

	it('should present toast error when site refresh fails', function () {
		var getSitesPromise = deferred();
		SiteActions.getAllSites.mockReturnValue(getSitesPromise.promise);

		expect(setInterval.mock.calls.length)
			.toBe(1);
		expect(setInterval.mock.calls[0][1])
			.toBe(30000);
		jest.runOnlyPendingTimers();
		expect(SiteActions.getAllSites)
			.toBeCalled();
		return getSitesPromise.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
		});
	});

	it('should display download link when image in NOT_FOUND state', function () {
		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual(testSites);
		expect(getTableElement(0, 3)
				.childNodes[0].childNodes[1].getAttribute('data-bcn-id'))
			.toBe('btn-siteimage-action');
	});


	it('should display generating element when image in IN_PROGRESS state', function () {
		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual(testSites);
		expect(getTableElement(2, 3)
				.querySelector('.Spinner'))
			.not.toBe(null);
	});

	it('should display disabled download link element when image in FAILED state', function () {
		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual(testSites);
		expect(getTableElement(3, 3)
				.childNodes[0].childNodes[1].getAttribute('data-bcn-id'))
			.toBe('btn-siteimage-action');
	});


	it('should make request to generate image when download button pressed', function () {
		SiteImageDownloadActions.requestSiteImage.mockClear();

		var ajaxPromise = deferred();
		SiteImageDownloadActions.requestSiteImage.mockReturnValue(ajaxPromise.promise);

		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual(testSites);
		expect(SiteImageDownloadActions.requestSiteImage)
			.not.toBeCalled();
		Simulate.click(getTableElement(0, 3)
			.childNodes[0].childNodes[1]);

		expect(SiteImageDownloadActions.requestSiteImage)
			.toBeCalled();
	});


	it('should generate error toast when request to generate site image fails', function () {
		var ajaxPromise = deferred();
		SiteImageDownloadActions.requestSiteImage.mockReturnValue(ajaxPromise.promise);

		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual(testSites);
		expect(SiteImageDownloadActions.requestSiteImage)
			.not.toBeCalled();
		Simulate.click(getTableElement(0, 3)
			.childNodes[0].childNodes[1]);
		expect(SiteImageDownloadActions.requestSiteImage)
			.toBeCalled();

		return ajaxPromise.rejectThen('fakeError', () => {
			expect(ToastActions.toast)
				.toBeCalled();
		});
	});

	it('should not make request to generate image when download button pressed in failed state', function () {
		SiteImageDownloadActions.requestSiteImage.mockClear();
		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();
		expect(sut.state.sites)
			.toEqual(testSites);
		expect(SiteImageDownloadActions.requestSiteImage)
			.not.toBeCalled();
		Simulate.click(getTableElement(3, 3)
			.firstChild);
		expect(SiteImageDownloadActions.requestSiteImage)
			.not.toBeCalled();
	});

	it('should not clear the error text when sites are updated', function () {
		sut.state.newData = {
			name: 'Toronto',
			location: '',
			forwardingDNS: '888.8.8.8'
		};

		sut._validateNewSiteData();
		expect(sut.state.messageText)
			.toContain('Please enter a valid IP address.');

		SiteStore.get = jest.fn(() => testSites);
		sut._handleSitesChange();

		expect(sut.state.messageText)
			.toContain('Please enter a valid IP address.');
	});

	it('should clear dns edit flag', function () {
		sut.setState({
			editingSiteId: 'siteId'
		});
		expect(sut.state.editingSiteId)
			.toEqual('siteId');
		sut._handleDNSEditClear();
		expect(sut.state.editingSiteId)
			.toEqual(null);
	});

	it('should clear dns edit on change', function () {
		sut.setState({
			forwarding_dns_ip: '1234'
		});
		let event = {
			target: {
				value: '4321'
			}
		};
		sut._handleDNSEditOnChange(event);
		expect(sut.state.forwarding_dns_ip)
			.toEqual('4321');
	});

	it('should handle mouse in', function () {
		sut.handleMouseIn();
		expect(sut.state.hover)
			.toEqual(true);
	});

	it('should handle mouse out', function () {
		sut.handleMouseOut();
		expect(sut.state.hover)
			.toEqual(false);
	});

	it('should handle editing DNS settings', function () {
		let siteA = createSite('siteA', 'siteAId', '1.0', '1.0', createImageInfo('NOT_FOUND'));
		sut._handleEditDNSSettings(siteA);
		expect(sut.state.editingSiteId)
			.toEqual(siteA.siteId);
		expect(sut.state.forwarding_dns_ip)
			.toEqual('');
		expect(sut.state.messageEditText)
			.toEqual(null);
	});

	it('should handle DNS update settings error null case', function () {
		let siteA = createSite('siteA', 'siteAId', '1.0', '1.0', createImageInfo('NOT_FOUND'));
		sut._handleDNSUpdateSettings(siteA);
		expect(sut.state.messageEditText)
			.toEqual(null);
		sut.setState({
			forwarding_dns_ip: null
		});
		sut._handleDNSUpdateSettings(siteA);
		expect(sut.state.messageEditText)
			.toEqual('Please enter a valid IP address.');
		expect(sut.state.isSubmitting)
			.toEqual(false);
	});
});
