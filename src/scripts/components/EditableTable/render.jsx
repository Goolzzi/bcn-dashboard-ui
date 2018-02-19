import React from 'react';
const Spinner = require('../Spinner').default;

export default {
    EditableTable: function () {
        return (
            <div className='EditableTable' data-bcn-id={'edittable-' + this.props.tableId}>
                <div ref='tableHeader' className='table-header'>
                    <table className='table'>
                        <thead>
                            <tr key="editableTable-headerRow">
                                { this.state.headers }
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className='table-addItem-container'>
                    <form onSubmit={ this._handleSubmit }  onReset={ this.props.handleOnClear } >
                        <table className='table-addItem'>
                            <tbody>
                                { this._makeAddElementRow() }
                            </tbody>
                        </table>
                    </form>
                    <div className='validation-error' data-bcn-id='validation-error-message'>{this.props.messageText}</div>
                </div>
                <div ref='tableBody' className='table-body'>
                    <Spinner display='block' key='top' classNames='text-center m-t-10 m-b-10'
                         show={this.props.isFetchingData}/>
                    <div>
                        <table className='table' data-bcn-id='datatable-table'>
                            <tbody>
                                { this._makeRows() }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    },

    AddActionColumn : function(disabled, actionWidth, key) {
        return (
            <td key={key} style={ {width: actionWidth, padding:'0%', 'textOverflow':'clip'} }>
                <button data-bcn-id='btn-add-save' type='submit' disabled={disabled}
                        className='btn-base btn-small btn-primary btn-table-save' />
                <button data-bcn-id='btn-add-clear' type='reset' disabled={disabled}
                        className='btn-base btn-small btn-default btn-table-clear'/>
            </td>
        );
    },

    AddElementColumn : function(component, item, key) {
        return (
                <td key={key} style={ {width:item.width} }>
                    <input type='text'
                           data-bcn-id={ 'edit-txt-add-' + item.inputName }
                           className='form-control'	
                           value={component.props.newData[item.inputName]}
                           onChange={component._handleOnChange.bind(component, item.inputName)}
                           disabled={component.props.isSubmitting}
                           placeholder={item.placeholder}/>
                </td>
        );
    }
};
