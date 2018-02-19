/**
 * Profile Component
 * @author Jorge Barnaby
 */

import React from 'react';
import components from './components.jsx';

const Profile = React.createClass({

	/** Property Types */
	propTypes: {
		userInfo: React.PropTypes.object.isRequired,
		customerName: React.PropTypes.string.isRequired

	},

	/** Get initial state */
	getInitialState() {
		return {
			showUserMenu: false
		};
	},

	handleToggleUserMenu() {
		this.setState({
			showUserMenu: !this.state.showUserMenu
		});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render() {
		return React.createElement(components.Profile, {
			userInfo: this.props.userInfo,
			customerName: this.props.customerName,
			handleToggleUserMenu: this.handleToggleUserMenu,
			showUserMenu: this.state.showUserMenu
		});
	}
});

export default Profile;
