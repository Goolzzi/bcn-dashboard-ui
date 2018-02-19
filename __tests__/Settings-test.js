jest.dontMock('../src/scripts/components/Settings/Settings');
jest.dontMock('../src/scripts/components/Settings/render.jsx');
jest.dontMock('../src/scripts/components/Overlay/Overlay.js');
jest.dontMock('../src/scripts/components/Overlay/render.jsx');

const deferred = require('../__testutils__/deferred.js')
	.default;

describe('Settings Component', function () {
	let Settings = require('../src/scripts/components/Settings')
		.default;
	let SettingsActions = require('../src/scripts/actions/SettingsActions')
		.default;
	let SettingsStore = require('../src/scripts/stores/SettingsStore')
		.default;
	let UserStore = require('../src/scripts/stores/UserStore')
		.default;
	let SettingsService = require('../src/scripts/services/SettingsService')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;
	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let Simulate = ReactTestUtils.Simulate;

	var sut;
	var element, nodeIpSettings, nodeCancelButton, nodeSaveButton, nodeErrorText, nodeCloseButton, nodeEditLink;

	var promises = {};

	var showEditSettings = () => {
		SettingsStore.getIsShown.mockReturnValue(true);
		sut._handleSettingsChange();

		nodeEditLink = element.querySelector('.btn-edit-dns');
		ReactTestUtils.Simulate.click(nodeEditLink);

		nodeIpSettings = element.querySelector('input.form-control');
		nodeSaveButton = element.querySelector('.btn-primary');
		nodeErrorText = element.querySelector('.form-error');
		nodeCancelButton = element.querySelector('.actions .btn-secondry');
	};

	var showSettingsSuccessThen = (factoryDefault, customerDefault, fn) => {
		showEditSettings();

		return promises.settings.resolveThen({
			servers: [{
				ipAddress: customerDefault
			}]
		}, () => {
			return promises.factory.resolveThen({
				servers: [{
					ipAddress: factoryDefault
				}]
			}, fn);
		});
	};

	var showSettingsFailureThen = fn => {
		showEditSettings();

		return promises.settings.rejectThen('fake error', () => {
			return promises.factory.rejectThen('fake error', fn);
		});
	};

	var submitIpSetting = (value) => {
		ReactTestUtils.Simulate.change(nodeIpSettings, {
			target: {
				value: value
			}
		});
		// ReactTestUtils.Simulate.click(nodeSaveButton);
		sut._handleUpdateSettings();
	};

	var verifyInputDisabled = (disabled) => {

		expect(nodeSaveButton.disabled)
			.toEqual(disabled);
		expect(nodeIpSettings.disabled)
			.toEqual(disabled);

		// ReactTestUtils.Simulate.click(nodeCancelButton);
		// if (disabled) {
		// 	expect(SettingsActions.hide)
		// 		.not.toBeCalled();
		// } else {
		// 	expect(SettingsActions.hide)
		// 		.toBeCalled();
		// }

		SettingsActions.updateSettings = jest.fn();
		ReactTestUtils.Simulate.click(nodeSaveButton);
		if (disabled) {
			expect(SettingsActions.updateSettings)
				.not.toBeCalled();
		} else {
			expect(SettingsActions.updateSettings)
				.toBeCalled();
		}
	};

	beforeEach(function () {
		promises.settings = deferred();
		promises.factory = deferred();
		promises.update = deferred();
		SettingsService.getSettings.mockReturnValue(promises.settings.promise);
		SettingsService.getFactorySettings.mockReturnValue(promises.factory.promise);
		SettingsService.updateSettings.mockReturnValue(promises.update.promise);

		UserStore.getUserInfo = jest.fn(() => {
			return {
				isAdministrator: function () {
					return true;
				}
			};
		});
		SettingsStore.getIsShown = jest.fn(() => false);
		SettingsActions.hide = jest.fn();
		ToastActions.toast.mockClear();

		sut = ReactTestUtils.renderIntoDocument( < Settings / > );

		element = ReactDOM.findDOMNode(sut);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(element)
			.parentNode);
	});

	it('should call getSettings and getFactoryDefaults when settings is displayed.', function () {

		SettingsStore.getIsShown.mockReturnValue(true);
		sut._handleSettingsChange();

		expect(SettingsService.getSettings)
			.toBeCalled();
		expect(SettingsService.getFactorySettings)
			.toBeCalled();
	});


	it('should disable input while getFactorySettings is in progress.', function () {
		showEditSettings();

		sut._getFactorySettings();

		expect(sut.state.get_factory_default_in_progress)
			.toBeTruthy();
		expect(nodeSaveButton.disabled)
			.toBeTruthy();
		expect(nodeIpSettings.disabled)
			.toBeTruthy();

	});

	it('should disable input while getSettings is in progress.', function () {
		showEditSettings();

		sut._getSettings();

		expect(sut.state.get_settings_in_progress)
			.toBeTruthy();
		expect(nodeSaveButton.disabled)
			.toBeTruthy();
		expect(nodeIpSettings.disabled)
			.toBeTruthy();
	});

	it('should disable input while updateSettings is in progress.', function () {
		showEditSettings();
		sut._handleUpdateSettings();

		expect(sut.state.get_settings_in_progress)
			.toBeTruthy();
		expect(nodeSaveButton.disabled)
			.toBeTruthy();
		expect(nodeIpSettings.disabled)
			.toBeTruthy();

	});

	it('should close editing when cancel button is clicked.', function () {
		showEditSettings();

		ReactTestUtils.Simulate.click(nodeCancelButton);

		expect(sut.state.isDNSEditing)
			.toBeFalsy();

		expect(element.querySelector('.btn-primary'))
			.toBeNull();
	});

	it('should hide edit link when user is not Administrator', function () {

		SettingsStore.getIsShown.mockReturnValue(true);
		UserStore.getUserInfo = jest.fn(() => {
			return {
				isAdministrator: function () {
					return false;
				}
			};
		});
		sut._handleSettingsChange();

		nodeEditLink = element.querySelector('.btn-edit-dns.hide');
		expect(nodeEditLink)
			.not.toBeNull();

	});

	it('should display editing form when edit link is clicked', function () {

		SettingsStore.getIsShown.mockReturnValue(true);
		sut._handleSettingsChange();

		nodeEditLink = element.querySelector('.btn-edit-dns.hide');
		ReactTestUtils.Simulate.click(nodeEditLink);
		expect(sut.state.isDNSEditing)
			.toBeTruthy();


		expect(element.querySelector('input.form-control'))
			.not.toBeNull();
		expect(element.querySelector('.btn-primary'))
			.not.toBeNull();
		expect(element.querySelector('.btn-secondry'))
			.not.toBeNull();

		// ReactTestUtils.Simulate.change(nodeIpSettings, { target: { value: '8.8.8.8' } });




		// expect(SettingsActions.hide)
		// 	.toBeCalled();
		// expect(SettingsService.updateSettings)
		// 	.toBeCalledWith({
		// 		forwarding_dns_ip: ip
		// 	});

	});

	it('should present an error if the user enters an invalid ip address', function () {

		showEditSettings();

		var ips = ['4.',
                   '256.4.3.2',
                   '.4.4.4.4',
                   '4.4.4.4.',
                   'A.B.C.D',
                   '2.2.2x.2',
                   '23456',
                   'thisisabadip'];

		ips.forEach(function (ip) {
			submitIpSetting(ip);

			expect(nodeErrorText.textContent)
				.toEqual('Please enter a valid IP address');
		});

	});

	it('should present an error if SettingService update settings fails.', function () {

		showEditSettings();

		submitIpSetting('8.8.8.8');

		return promises.update.rejectThen('fake error', () => {
			expect(ToastActions.toast)
				.toBeCalled();
		});
	});

	it('should accept empty input as valid value.', function () {

		showEditSettings();
		submitIpSetting('');

		return promises.update.resolveThen(undefined, () => {
			expect(SettingsService.updateSettings)
				.toBeCalledWith({
					forwarding_dns_ip: ''
				});
			expect(sut.state.isDNSEditing)
				.toBeFalsy();
		});
	});

	it('should clear the error text when input is changed.', function () {
		showEditSettings();

		submitIpSetting('256.5.5.5');

		expect(nodeErrorText.textContent)
			.toEqual('Please enter a valid IP address');

		ReactTestUtils.Simulate.change(nodeIpSettings, {
			target: {
				value: '3'
			}
		});
		expect(nodeErrorText.textContent)
			.toEqual('');

	});


	// it('should not call updateSettings when settings are not changed.', function () {
	// 	showEditSettings();

	// 	submitIpSetting('4.4.4.4');
	// 	expect(SettingsService.updateSettings)
	// 		.toBeCalled();

	// 	SettingsService.updateSettings.mockClear();

	// 	submitIpSetting('4.4.4.4');
	// 	expect(SettingsService.updateSettings)
	// 		.not.toBeCalled();

	// });

	it('should not enable input if load settings fails.', function () {

		showEditSettings();

		return promises.settings.rejectThen('fake error', () => {

			expect(sut.state.load_failed)
				.toBeTruthy();
			expect(ToastActions.toast)
				.toBeCalled();

		});

	});


});
