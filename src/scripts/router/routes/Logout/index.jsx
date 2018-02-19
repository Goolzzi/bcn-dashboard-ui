import React from 'react';
import { Router, Route, Redirect, IndexRoute } from 'react-router'; 
import Logout from './components/Logout';

/**
 * Logout route
 */
var route = <Route path='logout' component={ Logout } />;

export default route;
