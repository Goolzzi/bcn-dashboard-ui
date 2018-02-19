import React from 'react';
import classNames from 'classnames';

export default {
    Tab: function (props) {
        return (
            <a key={ props.key } className={ classNames({'Tab': true, 'active': props.isActive}) }>
                <span>{ props.item.title }</span>
            </a>
        );
    },

    Tabs: function () {
        return (
            <div className='Tabs'>
                <div className='tabs' ref='tabs'>
                    { this._makeTabs() }
                </div>
                <div className='tabs-clear'></div>
                <div className='tab-content' ref='content'>
                    { this._makeContent() }
                </div>
            </div>
        );
    }
};
