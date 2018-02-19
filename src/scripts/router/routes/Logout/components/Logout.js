/**
 * Logout Component
 * @author Alexander Luksidadi
 */

import React from 'react';
import AuthActions from '../../../../actions/AuthActions';
import AppConstants from '../../../../constants/AppConstants';

/**
 * Logout Component
 */
var Logout = React.createClass({

	/** Context types */
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	/** Fires after component is mounted */
	componentDidMount: function () {
		AuthActions.logout()
			.then(() => {
				this.context.router.push(AppConstants.LOGIN_ROUTE);
			})
			.catch(() => {
				this.context.router.push(AppConstants.LOGIN_ROUTE);
			});
	},

	/**
	 * Renders component
	 * @returns {DOM}
	 */
	render: function () {
		return React.createElement('div', {
			className: 'Logout'
		});
	}
});

export default Logout;
