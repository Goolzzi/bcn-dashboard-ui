import React from 'react';
import Overlay from '../Overlay';
import ProfileScreen from '../ProfileScreen';



export default {
    Settings: function() {
        if (!this.state.isShown) {
            return <div />;
        }

        var isDisabled = this._isDisabled();
        var isAdminSettingDisabled = isDisabled || this._isUserAdministrator() === false || this.state.load_failed === true;
        var isSaveDisabled = isDisabled || this.state.load_failed === true;

        return (
            <div data-bcn-id='screen-settings-user'>
                <Overlay
                    className='Settings'
                    zIndexClass = { '1' }
                    closeHandler = { this._handleOverlayClose }
                    isShown = { true }
                    isLoading = { this.state.update_setting_in_progress }
                    breadcrumb = { [{title: 'Settings'}] } >

                    <div className='row'>
                        <div className='col-sm-12'>
                            <h3>DNS Forwarding</h3>

                            <div className='col-sm-2 '>
                                <p className='form-control-static'>DEFAULT FORWARDER:</p>
                            </div>

                            <div className='col-sm-10'>

                                { this.state.isDNSEditing ?
                                    <div className = { 'edit_wrapper ' } >

                                        <input ref='forwarding_dns_ip' type='text'
                                            className={'form-control '}
                                            disabled={isAdminSettingDisabled}
                                            id='forwarding_dns_ip'
                                            value={this.state.forwarding_dns_ip}
                                            placeholder={ this.state.factory_default_forwarding_ip + ' (default)' }
                                            onChange={this._handleInputChange} />

                                        <span className={ 'form-group actions '}>
                                            <button className='btn btn-primary btn-has-fa-icon' disabled={isSaveDisabled}  onClick={ this._handleUpdateSettings }><span className='fa fa-check-thin'></span></button>
                                            <button className='btn btn-secondry btn-has-fa-icon' onClick={ this._handleCloseButton }><span className='fa fa-times'></span></button>
                                        </span>
                                        <div className='form-error'>{ this.state.ipError }</div>
                                    </div>
                                    :
                                    <div>
                                        <p className='form-control-static'>
                                            { this.state.forwarding_dns_ip || this.state.factory_default_forwarding_ip + ' (default)' }
                                            <a className={ 'btn-edit-dns ' + (isAdminSettingDisabled ? 'hide' : '') } onClick={ this._handleDNSEdit }>Edit</a>
                                        </p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='col-sm-12'>
                            <h3><a>Users</a></h3>
                        </div>
                        <div className='col-sm-12'>
                            <h3><a onClick={ this._openProfile }>Profile</a></h3>
                        </div>
                        <div className='col-sm-12'>
                            <h3><a>Terms of Service</a></h3>
                        </div>
                    </div>

                </Overlay>
            </div>
        );
    }
};
