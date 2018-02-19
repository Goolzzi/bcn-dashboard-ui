import React from 'react';
import { Router, Route, Redirect, IndexRoute } from 'react-router';
import ResetPassword from './components/ResetPassword';

/**
 * Login route
 */
var route = <Route path='resetPassword' component={ ResetPassword } />;

export default route;
