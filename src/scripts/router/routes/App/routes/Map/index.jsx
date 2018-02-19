import React from 'react';
import { Router, Route, Redirect, IndexRoute } from 'react-router'; 
import MapView from './components/MapView';

/**
 * Map route
 */
var route = <Route path='map' component={ MapView } />;

export default route;
