jest.unmock('../src/scripts/components/Overlay/Overlay.js');
jest.unmock('../src/scripts/components/Overlay/render.jsx');
jest.unmock('../src/scripts/components/DataTable/DataTable');
jest.unmock('../src/scripts/components/DataTable/render.jsx');
jest.unmock('../src/scripts/components/Policies/Policies');
jest.unmock('../src/scripts/components/Policies/render.jsx');
jest.unmock('../src/scripts/components/Spinner/Spinner');
jest.unmock('../src/scripts/components/Spinner/render.jsx');
jest.unmock('stable');

jest.unmock('lodash');
jest.unmock('natural-compare-lite');

describe('Policy component tests', function () {

	let _ = require('lodash');
	let Policies = require('../src/scripts/components/Policies/Policies')
		.default;
	let PolicyStore = require('../src/scripts/stores/PolicyStore')
		.default;
	let PolicyActions = require('../src/scripts/actions/PolicyActions')
		.default;
	let ToastActions = require('../src/scripts/actions/ToastActions')
		.default;

	let ReactTestUtils = require('react-addons-test-utils');
	let ReactDOM = require('react-dom');
	let React = require('react');
	let naturalCompare = require('natural-compare-lite');
	let deferred = require('../__testutils__/deferred')
		.default;

	var sut, element;

	var createPolicy = (name, description, action, status) => {
		return {
			name: name,
			description: description,
			action: {
				type: action
			},
			active: status
		};
	};

	let testPolicies = [createPolicy('policy1', 'policy1Description', 'block', 'active'),
						 createPolicy('policy2', 'policy2Description', 'block', 'inactive'),
						 createPolicy('policy3', 'policy3Description', 'block', 'active'),
						 createPolicy('policy4', 'policy4Description', 'monitor', 'active'),
						 createPolicy('policy5', 'policy5Description', 'monitor', 'inactive'),
						 createPolicy('policy6', 'policy6Description', 'monitor', 'active')];

	let createPolicyPromise, updatePolicyPromise, getAllPromise;

	beforeEach(function () {

		createPolicyPromise = deferred();
		updatePolicyPromise = deferred();
		getAllPromise = deferred();
		PolicyActions.getAll.mockReturnValue(getAllPromise.promise);

		ToastActions.toast.mockClear();
		PolicyStore.getPolicies.mockReturnValue([]);

		sut = ReactTestUtils.renderIntoDocument( < Policies / > );
		sut._handleChange();

		element = ReactDOM.findDOMNode(sut);
	});

	afterEach(function () {
		ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sut)
			.parentNode);
	});

	it('should have rendered element', function () {
		expect(element)
			.not.toBeNull();
	});

	it('should have an overlay element', function () {
		var overlay = element.querySelector('.Overlay');
		expect(overlay)
			.not.toBeNull();
	});

	it('should set proper messageText when list of policies is empty', function () {
		var policies = null;
		PolicyStore.getAll = jest.fn(() => policies);
		sut._handleChange();
		expect(sut.state.messageText)
			.toEqual('No policies found.');
	});

	it('when policy store changes, state of policies component should contain updated policies', function () {
		var policies = null;
		PolicyStore.getAll = jest.fn(() => policies);
		sut._handleChange();
		expect(sut.state.policies)
			.toEqual([]);
		policies = [testPolicies[0], testPolicies[1], testPolicies[2], testPolicies[3]];
		PolicyStore.getPolicies = jest.fn(() => policies);
		sut._handleChange();
		expect(sut.state.policies)
			.toEqual([testPolicies[0], testPolicies[1], testPolicies[2], testPolicies[3]]);
	});

	it('should close when close button is clicked', function () {
		var closeButtonIcon = element.querySelector('.close-button');
		ReactTestUtils.Simulate.click(closeButtonIcon);

		expect(PolicyActions.close)
			.toBeCalled();
	});

	it('should close when _handleOverlayClose is called', function () {

		sut._handleOverlayClose();
		expect(PolicyActions.close)
			.toBeCalled();
	});

	it('should call PolicyStore addChangeListener when componentMount is called', function () {
		sut.componentWillUnmount();
		expect(PolicyStore.addChangeListener)
			.toBeCalled();
	});

	it('should call PolicyStore removeChangeListener when componentWillMount is called', function () {
		sut.componentWillUnmount();
		expect(PolicyStore.removeChangeListener)
			.toBeCalled();
	});

	it('should return correct metadata given Policy', function () {
		let emptyPolicy = {};
		expect(sut.state.metadata[0].value(testPolicies[0]))
			.toEqual('policy1');
		expect(sut.state.metadata[1].value(testPolicies[0]))
			.toEqual('policy1Description');
		expect(sut.state.metadata[2].value(testPolicies[0])
				.props.children.props.children)
			.toEqual("block");
		expect(sut.state.metadata[3].value(testPolicies[0])
				.props.children)
			.toEqual("active");
	});

	it('should get the correct edit button', function () {
		let editButton = sut.state.metadata[4].value(testPolicies[0]);
		expect(editButton.type)
			.toEqual('button');
		expect(editButton.props.className)
			.toContain('btn-edit-image');
	});

	it('should perform natural comparison on name', function () {
		expect(sut.state.metadata[0].sortComparator(testPolicies[4], testPolicies[5]))
			.toEqual(-1);
		expect(sut.state.metadata[0].sortComparator(testPolicies[5], testPolicies[4]))
			.toEqual(1);
	});

	it('should perform natural comparison on action type when sorting', function () {
		expect(sut.state.metadata[1].sortComparator(testPolicies[4], testPolicies[5]))
			.toEqual(-1);
		expect(sut.state.metadata[1].sortComparator(testPolicies[5], testPolicies[4]))
			.toEqual(1);
	});

	it('should perform a string comparison on action', function () {
		expect(sut.state.metadata[2].sortComparator(testPolicies[2], testPolicies[3]))
			.toEqual(-1);
		expect(sut.state.metadata[2].sortComparator(testPolicies[3], testPolicies[2]))
			.toEqual(1);
		expect(sut.state.metadata[2].sortComparator(testPolicies[1], testPolicies[2]))
			.toEqual(0);
	});

	//Policy comparison on status reversed because of true=active, false=inactive
	it('should perform a string comparison on status', function () {
		expect(sut.state.metadata[3].sortComparator(testPolicies[0], testPolicies[1]))
			.toEqual(1);
		expect(sut.state.metadata[3].sortComparator(testPolicies[1], testPolicies[0]))
			.toEqual(-1);
		expect(sut.state.metadata[3].sortComparator(testPolicies[0], testPolicies[2]))
			.toEqual(0);
	});

});
