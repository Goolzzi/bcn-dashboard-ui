var React = require('react');
import Toast from '../Toast';
import Overlay from '../Overlay';
import TextFieldGroup from '../Common/TextFieldGroup';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Spinner from '../Spinner';
import _ from 'lodash';

export default {
    ProfileScreen: function() {

        if(!this.state.isShown) {
            return ( <div />);
        }

    	const tooltip = (
		   <Tooltip id='reset-password-save-tooltip' className='tooltip-base' data-bcn-id='tooltip-save-info'>
		        You will be asked to login<br/>with your new password.
		   </Tooltip>
		);

        const { user, isSubmitting } = this.state;
        const passwordForm = this.state.passwordForm;
		const isFormReady = this.isFormReady()

    	return (
        		<div data-bcn-id='screen-profile-user' className='ProfileScreen'>
                <Overlay
                    zIndexClass = { '2' }
                    closeHandler = { this._handleOverlayClose }
                    isShown = { true }
                    breadcrumb = { [{title: 'Settings'}, {title: 'Profile'}] } >

                    <div className='row'>
                        <div className='col-sm-2'>
                            <p className='form-control-static'>USER:</p>
                        </div>

                        <div className='col-sm-10'>
                    		{user === null || _.isEmpty(user.username) ?
                        		<Spinner display='table' divClassNames='inputbox-spinner' classNames='btn-noborderspin'
                                show={ true } />
                                :
	                          	<p className='form-control-static'>{user.username}</p>
	                        }
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-sm-2 '>
                            <p className='form-control-static'>EMAIL:</p>
                        </div>

                        <div className='col-sm-10'>
                            {user === null || _.isEmpty(user.username) ?
                                <Spinner display='table' divClassNames='inputbox-spinner' classNames='btn-noborderspin'
                                show={ true } />
                                :
                                <p className='form-control-static'>{user.username}</p>
                            }
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-sm-2 '>
                            {user === null || _.isEmpty(user.role) ?
                                <Spinner display='table' divClassNames='inputbox-spinner' classNames='btn-noborderspin'
                                show={ true } />
                                :
                                <p className='form-control-static'>{user.role}:</p>
                            }
                        </div>

                        <div className='col-sm-10'>
                            {user === null ?
                                <Spinner display='table' divClassNames='inputbox-spinner' classNames='btn-noborderspin'
                                show={ true } />
                                :
                                <p className='form-control-static'>{user.hasOwnProperty('username') ? user.username: ''}<br/>{user.hasOwnProperty('email') ? user.email: ''}</p>
                            }
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-2 '>
                            <p className='form-control-static'>PASSWORD:</p>
                        </div>

                        <div className='col-sm-10'>
                            { passwordForm === null &&
                                <p className='form-control-static'><a data-bcn-id="password-update-link" onClick={this._handlePasswordUpdate}>UPDATE</a></p>
                            }
                        </div>
                    </div>
                    { passwordForm &&
                        <div className='row m-t-20'>
                        	<div className='col-sm-4'>
    							<div className="bc-form">

    			                    <TextFieldGroup
    			                      error = { passwordForm.errors.currentPassword }
    			                      label = "Current Password"
    			                      bcnID = "input-current-password"
    			                      onChange = { this._handleFieldValueChange }
    			                      onBlur = { this._handleFieldValueChange }
    			                      disabled = { isSubmitting }
    			                      value = { passwordForm.currentPassword }
    			                      field = "currentPassword"
    			                      type = "password"  />

    			                    <TextFieldGroup
    			                      error = { passwordForm.errors.newPassword }
    			                      label = "New Password"
    			                      bcnID = "input-new-password"
    			                      onChange = { this._handleFieldValueChange }
    			                      disabled = { isSubmitting }
    			                      value = { passwordForm.newPassword }
    			                      field = "newPassword"
    			                      type = "password"   />

    			                    <TextFieldGroup
    			                      error = { passwordForm.errors.confirmNewPassword }
    			                      label = "Confirm New Password"
    			                      bcnID = "input-confirm-new-password"
    			                      onChange = { this._handleFieldValueChange }
    			                      disabled = { isSubmitting }
    			                      value = { passwordForm.confirmNewPassword }
    			                      field = "confirmNewPassword"
    			                      type = "password"  />


                                    <div className="form-group m-t-40">

        			                    { isFormReady ?
        				                    <OverlayTrigger id='reset-password-save-tooltip-overlay' animation={true} placement='bottom' overlay={tooltip}>
        			  				            <button className="btn pull-right btn-secondry active" data-bcn-id="btn-submit" disabled={this.state.isSubmitting} onClick={this._handleSubmit}>Save</button>
        			  				        </OverlayTrigger>
        							      :
        					                <button className="btn pull-right btn-secondry" data-bcn-id="btn-submit" disabled={this.state.isSubmitting} onClick={this._handleSubmit}>Save</button>
        					            }
                                        <a className='link-cancel pull-right' onClick={this._handlePasswordFormCancel}>Cancel</a>
                                    </div>

    			                </div>
    		                </div>
                    	</div>
                    }
                </Overlay>
            </div>
        );
    }
};
