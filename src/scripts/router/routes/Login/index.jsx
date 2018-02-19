import React from 'react';
import { Router, Route, Redirect, IndexRoute } from 'react-router'; 
import Login from './components/Login';

/**
 * Login route
 */
var route = <Route path='login' component={ Login } />;

export default route;
