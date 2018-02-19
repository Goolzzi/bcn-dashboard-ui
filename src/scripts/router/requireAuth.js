/**
 * Require auth handler
 * @author: Alexander Luksidadi
 */

import AuthStore from '../stores/AuthStore';

// Component requires authentication
function requireAuth(nextState, replace, callback) {
	if (!AuthStore.isAuthenticated()) {
		window.location.hash = '#/login';
	} else {
		callback();
	}
}

export default requireAuth;
