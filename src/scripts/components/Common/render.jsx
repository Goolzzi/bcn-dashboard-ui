import React from 'react';
import classnames from 'classnames';
const Spinner = require('../Spinner')
	.default;

export default {
	TextFieldGroup: function () {
		let props = this.props;

		if (props.hasSpinner) {

			return (
				<div className={ classnames('input-group', { 'has-error': props.error }) } >

					{ props.label != '' ?
						<label className={classnames('slide-in-on-display', {'show':props.value} )}>{props.label}</label>
						: null
					}

					<input
						onChange = { props.onChange }
						onBlur = { props.onBlur }
						disabled = { props.disabled }
						value = { props.value }
						type = { props.type }
						name = { props.field }
						data-bcn-id = { props.bcnID }
						placeholder = { props.label }
						className = "form-control"   />

					<span className="input-group-addon">
						<Spinner display='table' divClassNames='inputbox-spinner' data-bcn-id={props.bcnID} classNames='btn-noborderspin'
							show={ props.isInProcess } disabled = { props.disabled }  />
					</span>

					<span className="help-block">{props.error}</span>

				</div>
			);

		}

		return (
            <div className={ classnames('form-group', { 'has-error': props.error }) }>

                { props.label != '' ?
                    <label className={ classnames('slide-in-on-display', {'show':props.value} ) }>{ props.label }</label>
                    : null              
                }               

                <input          
                    onChange = { props.onChange }
                    onBlur = { props.onBlur }
                    disabled = { props.disabled }
                    value = { props.value }
                    type = { props.type }
                    name = { props.field }
                    data-bcn-id = { props.bcnID }
                    placeholder = { props.label }
                    className="form-control"   />

                <span className="help-block">{ props.error }</span>

            </div>      
		);
	}
};

