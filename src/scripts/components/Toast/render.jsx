import React from 'react'; 
import CSSTransitionGroup from 'react-addons-css-transition-group';

const Message = (props) => {
    var closeButton;
    if ( props.type !== 'application-error' &&
         props.type !== 'dnsquerylog-new' )
    {
        closeButton = <div className='toast-close-button' onClick={ function () {props.handleClick(props);} }>
                        <span>Dismiss</span>
                    </div>;
    }
    return (
        <div data-bcn-id={'toast-'+props.type+'-'+props.id}>
            <div className={ 'toast toast-' + props.type + (props.fat ? ' toast-fat' : '')} onClick={ function() {props.handleClick(props);} }>
                <div className='toast-message'>{ props.text }</div>
                { closeButton }
            </div>
        </div>
    );
};

export default {
    Toast: function () {
        return (
            <div className='Toast'>
                <div id='toast-container' className='toast-top-center'>
                    <CSSTransitionGroup transitionName="swing" transitionEnter={this.props.animate} transitionLeave={this.props.animate} transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                        { this._makeMessages() }
                    </CSSTransitionGroup>
                </div>
            </div>
        );
    },
    Message: function (props) {
        return (<Message { ...props } />);
    }
};
