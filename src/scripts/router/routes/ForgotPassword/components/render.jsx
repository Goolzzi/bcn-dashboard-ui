var React = require('react');
import Toast from '../../../../components/Toast';
const Spinner = require('../../../../components/Spinner').default;

export default {
    ForgotPassword: function() {
        return (
              <div className="ForgotPassword container-fluid">
              <Toast animate={false} />
              <div style={{cursor: 'pointer'}} onClick={this.redirectToLogin}>
                <div className="row">
                    <div className="col-sm-offset-4 col-sm-4">
                        <div className="logo"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-offset-3 col-sm-6">
                        <h2 className="text-center">DNS SECURITY</h2>
                    </div>
                </div>
                </div>

                { !this.state.isEmailSent ?
                    <form className="form">
                        <div className="row">
                            <div className="col-sm-offset-3 col-sm-6">
                                <p className="text-center">FORGOT YOUR PASSWORD?<br/>
                                    Please enter the email associated with your account</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="col-sm-6 col-sm-offset-3 text-center">
                                    <div className="input-group has-spinner">
                                        <input type="email" className="form-control" id="email" data-bcn-id="input-email" disabled={ this.state.isSubmitting } placeholder="Email Address" ref="email" />
                                        <span className="input-group-addon">
                                            <Spinner display='table' divClassNames='inputbox-spinner' classNames='btn-noborderspin' show={ this.state.isSubmitting }  />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group">
                                <div className="col-sm-4 col-sm-offset-4 text-center">
                                    <button className="btn btn-primary" data-bcn-id="btn-submit" onClick={ this.handleForgotPasswordRequest } disabled={ this.state.isSubmitting }>Email ME</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    :
                    <div className="row clickable"  onClick={ this.redirectToResetPassword }>
                        <div className="col-sm-offset-3 col-sm-6">
                            <p className="text-center">
                            An email is on the way.<br/><br/>

                            We&#39;ve sent a link that you can use to get back into your account.<br />
                            The message should arrive in your inbox shortly.</p>
                        </div>
                    </div>

                }
                <div className="footer">
                    <div className="copyright">
                        <p>© 2016 BlueCat Networks  - All Rights Reserved</p>
                    </div>
                </div>
            </div>
        );
    }
};
