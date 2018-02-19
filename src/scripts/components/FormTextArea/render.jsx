import React from 'react'; // eslint-disable-line no-unused-vars

export default {
    FormTextArea: function () {
        return (
            <div className={ "FormTextArea form-group" + (this.props.inputValidationMessage !== null ? " has-error": "") }>
                <label className={"SlideInOnShow " + (this.props.value != '' ? 'show':'')}> {this.props.inputLabelText }</label>
                <textarea className={"form-control" + (this.props.resize === false ? " textarea-resize-disabled": "") }
                    placeholder={ this.props.placeHolderText }
                    value={ this.props.value }
                    onChange= { this.props.handleInputValueChange }
                    maxLength= { this.props.maxLength } />
                <span className={"help-block "+ (this.props.inputValidationMessage === null ? "hide":"")}>{this.props.inputValidationMessage}</span>
            </div>
        );
    }
};
