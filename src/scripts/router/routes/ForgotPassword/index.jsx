import React from 'react';
import { Router, Route, Redirect, IndexRoute } from 'react-router';
import ForgotPassword from './components/ForgotPassword';

/**
 * Login route
 */
var route = <Route path='forgotPassword' component={ ForgotPassword } />;

export default route;
