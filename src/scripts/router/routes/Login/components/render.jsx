var React = require('react');
import Toast from '../../../../components/Toast';

export default {
    Login: function() {
        return (
              <div className="Login container-fluid">
              <Toast animate={false} />

                <div className="row">
                    <div className="col-sm-offset-4 col-sm-4">
                        <div className="logo"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-offset-3 col-sm-6">
                        <h2 className="text-center">DNS SECURITY</h2>
                        <h1 className="text-center" data-bcn-id="text-login-companyname">{ this.state.customerName }</h1>
                    </div>
                </div>

                <form className="form">
                    <div className="row">
                        <div className="form-group">
                            <div className="col-sm-6 col-sm-offset-3 text-center">
                                <div className="input-container">
                                    <input type="email" className="form-control" id="email" data-bcn-id="input-email" disabled={ this.state.isSubmitting } placeholder="Email Address" ref="email" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <div className="col-sm-6 col-sm-offset-3 text-center">
                                <div className="input-container">
                                    <input type="password" className="form-control" id="password" data-bcn-id="input-password" disabled={ this.state.isSubmitting } placeholder="Password" ref="password" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <div className="col-sm-4 col-sm-offset-4 text-center">
                                <button className="btn btn-primary" data-bcn-id="btn-login" onClick={ this.handleLogin } disabled={ this.state.isSubmitting }>Log In</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <div className="col-sm-4 col-sm-offset-4 text-center forgot-password">
                                <a className="forgot-password" onClick={ this.handleForgotPassword }>Forgot Password?</a>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="footer">
                    <div className="copyright">
                        <p>© 2016 BlueCat Networks  - All Rights Reserved</p>
                    </div>
                </div>
            </div>
        );
    }
};
