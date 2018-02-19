import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import MapView from './routes/Map/components/MapView';

import MapRoute from './routes/Map';
import DataRoute from './routes/Data';
import ToastActions from '../../../actions/ToastActions';

import requireAuth from '../../requireAuth';

var clearToastStore = ()=> {
    ToastActions.removeAll();
};

/**
 * App route
 */
var route = (
    <Route path='app' component={ App } onEnter={ requireAuth } onChange={ clearToastStore } >
        <IndexRoute component={ MapView } />
        { MapRoute }
        { DataRoute }
    </Route>
);

export default route;
