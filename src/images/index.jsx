import React from 'react';
import { Router, Route, Redirect, IndexRoute } from 'react-router'; 
import SitesView from './components/Sites';

/**
 * Site route
 */
var route = <Route path='sites' component={ SitesView } />;

export default route;
