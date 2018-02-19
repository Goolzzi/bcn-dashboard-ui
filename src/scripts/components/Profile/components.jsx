import React from 'react'; 
import { Link } from 'react-router';

var menus = [
    { name: 'Logout', path: '/logout', bcn_id: 'menu-user-item-logout' }
];

const UserMenu = props => (
    <div data-bcn-id='menu-user' className='UserMenu'>
        <ul>
            { menus.map(e => (
                <li key={ e.path }>
                    <Link data-bcn-id={ e.bcn_id } to={ e.path }>{ e.name }</Link>
                </li>
            )) }
        </ul>
        <div className='arrow-border'></div>
        <div className='arrow'></div>
    </div>
);

const Profile = props => (
    <div className='Profile'>
        <div className='logo'>
            <img src='/images/logo-32x32.png' />
        </div>
        <div className='details'>
            <div className='company-name' data-bcn-id='text-profile-companyname'>{ props.customerName }</div>
            <div className='user-profile'>
                <div className='user-data'>
                    <span data-bcn-id='text-profile-userrole' className='role'>{ props.userInfo.role }</span>&nbsp;:&nbsp;
                    <span className='name'>{ props.userInfo.username }</span>&nbsp;
                    <span data-bcn-id='menu-user-display' className='user-menu-toggle' onClick={ props.handleToggleUserMenu }>v</span>
                </div>
                { props.showUserMenu ? <UserMenu /> : null }
            </div>
        </div>
    </div>
);

export default {
    UserMenu: UserMenu,
    Profile: Profile
};
