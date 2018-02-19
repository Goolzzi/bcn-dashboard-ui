import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import Profile from '../Profile';
import Clock from '../Clock';

const DateAndTime = props => (
    <div data-bcn-id='dashboard-datetime' className='DateAndTime'>
        <span data-bcn-id='date'>{ moment().format('MMMM DD, YYYY') }</span>
        <span className='separator'>-</span>
        <Clock live={ true } />
    </div>
);

const MainNav = props => {
    return (
        <div className='MainNav' data-bcn-id="view-toggle">
            <ul className='list-inline'>
                <li id='nav-map' className={ /\/app\/map.*/.test(props.path) ? 'active' : '' }>
                    <Link to='/app/map'><span>Map</span></Link>
                </li>
                <li id='nav-data' className={ /\/app\/data.*/.test(props.path) ? 'active' : '' }>
                    <Link to='/app/data'><span>Data</span></Link>
                </li>
            </ul>
        </div>
    )
};

/**
 * Header Component - Date And Time
 */
export default {
    Header: function () {
        return (
            <div>
                <div className='Header-dashboard container-fluid'>
                    <MainNav path={ this.props.location.pathname } />
                </div>
                <DateAndTime />
                <Profile userInfo={ this.props.userInfo } customerName={ this.props.customerName }/>
            </div>
        );
    }
};
