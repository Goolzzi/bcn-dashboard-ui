import React from 'react';

export default {
    Spinner: function () {
        var display = this.props.display ? this.props.display : 'inline';
        var style = { display: this.props.show ? display : 'none', textAlign: 'center' };
        if (this.props.center) {
            style.height = '100%';
            style.position = 'absolute';
            style.top = '50%';
            style.left = '50%';
        }
        if (this.props.policyload) {
          style.height = '100%';
          style.position = 'inherit';
        }

        return (
            <div className={'Spinner ' + this.props.divClassNames} style={ style }>
                <i className={ 'fa fa-spinner fa-spin ' + this.props.classNames }></i>
            </div>
        );
    }
};
