import React from 'react';
import { Router, Route, Redirect, IndexRoute, hashHistory } from 'react-router';
import Login from './routes/Login/components/Login';
import RouteLogin from './routes/Login';
import RouteForgotPassword from './routes/ForgotPassword';
import RouteResetPassword from './routes/ResetPassword';
import RouteLogout from './routes/Logout';
import RouteApp from './routes/App';

/**
 * Root route
 */
var router = (
    <Router history={ hashHistory }>
        <Route path='/'>
            <IndexRoute component={ Login } />
            { RouteLogin }
            { RouteForgotPassword }
            { RouteResetPassword }
            { RouteLogout }
            { RouteApp }
        </Route>
    </Router>
);

export default router;
