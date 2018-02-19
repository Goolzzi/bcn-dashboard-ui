var React = require('react');
import Toast from '../../../../components/Toast';
import TextFieldGroup from '../../../../components/Common/TextFieldGroup';
import classnames from 'classnames';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

export default {
    ResetPassword: function() {

		const tooltip = (
		   <Tooltip id='reset-password-save-tooltip' className='tooltip-base' data-bcn-id='tooltip-save-info'>
		        You will be asked to login<br/>with your new password.
		   </Tooltip>
		);

        const { errors, identifier, password, isSubmitting } = this.state;
        const isFormReady = this.isFormReady()
        return (
              <div className="ResetPassword container-fluid">
              <Toast animate={false} />

                <div className="row">
                    <div className="col-sm-offset-4 col-sm-4">
                        <div className="logo" onClick={this.redirectToLogin}></div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-offset-4 col-sm-4">
                        <h1 className="text-center">Reset Password</h1>
                    </div>
                </div>

                <div className="col-sm-4 col-sm-offset-4">

                <div className="bc-form">

                    { errors.form && <div className="alert alert-danger">{errors.form}</div> }

                    <TextFieldGroup
                      error = { errors.currentPassword }
                      label = "Temporary Password"
                      bcnID = "input-temp-password"
                      onChange = { this.onChange }
                      onBlur = { this.onChange }
                      disabled = { this.state.isSubmitting }
                      value = { this.state.currentPassword }
                      field = "currentPassword"
                      type = "password"  />

                    <TextFieldGroup
                      error = { errors.newPassword }
                      label = "New Password"
                      bcnID = "input-new-password"
                      onChange = { this.onChange }
                      disabled = { this.state.isSubmitting }
                      value = { this.state.newPassword }
                      field = "newPassword"
                      type = "password"   />

                    <TextFieldGroup
                      error = { errors.confirmNewPassword }
                      label = "Confirm New Password"
                      bcnID = "input-confirm-new-password"
                      onChange = { this.onChange }
                      disabled = { this.state.isSubmitting }
                      value = { this.state.confirmNewPassword }
                      field = "confirmNewPassword"
                      type = "password"  />


                    { isFormReady ?
	                    <OverlayTrigger id='reset-password-save-tooltip-overlay' animation={true} placement='bottom' overlay={tooltip}>
    				            <button className="btn pull-right btn-secondry active" data-bcn-id="btn-submit" disabled={this.state.isSubmitting} onClick={this._handleSubmit}>Save</button>
      				        </OverlayTrigger>
    				        :
		                  <button className="btn pull-right btn-secondry" data-bcn-id="btn-submit" disabled={this.state.isSubmitting} onClick={this._handleSubmit}>Save</button>
		                }

                </div>
              </div>

              <div className="footer">
                  <div className="copyright">
                      <p>© 2016 BlueCat Networks  - All Rights Reserved</p>
                  </div>
              </div>
            </div>
        );
    }
};
