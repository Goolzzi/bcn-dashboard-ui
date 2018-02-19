import React from 'react'; // eslint-disable-line no-unused-vars

export default {
    FormTextInput: function () {
        return (
                <div className={ "form-group" + (this.props.inputValidationMessage !== null ? " has-error": "") }>
                    <label className={"SlideInOnShow " + (this.props.value != '' ? 'show':'')}> {this.props.inputLabelText }</label>
                    <input type="text"
                        className="form-control input-blue"
                        placeholder={ this.props.placeHolderText }
                        value={ this.props.value }
                        onChange= { this.props.handleInputValueChange }
                        maxLength= { this.props.maxLength } />
                    <span className={"help-block "+ (this.props.inputValidationMessage === null ? "hide":"")}>{this.props.inputValidationMessage}</span>
                </div>
            );
    }
};
