import React from 'react';
import { Route } from 'react-router';
import DataView from './components/DataView';

/**
 * Data route
 */
var route = (
    <Route path='data' component={ DataView }>
        <Route path=':activity' />
    </Route>
);

export default route;
