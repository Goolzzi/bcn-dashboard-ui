import React from 'react';
import Spinner from '../Spinner';

export default {

    DataTable: function () {
        var messageStyle = { display: this.props.messageText ? 'inline' : 'none' };
        var tableStyle = { display: this.props.messageText ? 'none' : 'inline' };
        var showLoadingSpinner = this.props.isFetchingNextDataPage && (!this.props.data || this.props.data.length === 0);
        return (
            <div className='DataTable' data-bcn-id={'datatable-' + this.props.tableId}>
                <div ref='tableHeader' className='table-header'>
                    <table className='table'>
                        <thead>
                            <tr>
                                { this._makeHeaders() }
                            </tr>
                        </thead>
                    </table>
                </div>
                <div ref='tableBody' className='table-body'>
                    <Spinner id='spinner-datatable-prev' display='block' key='top' classNames='text-center m-t-10 m-b-10'
                             style = {this.state.tableBodyWidth ? {width: this.state.tableBodyWidth+'px'}: null}
                             show={this.props.isFetchingPrevDataPage}/>
                    <div style={tableStyle}>
                        <table className='table' data-bcn-id='datatable-table'>
                            <tbody>
                                { this._makeRows() }
                            </tbody>
                        </table>
                    </div>
                    <div className='table-message'
                         style={messageStyle}
                         data-bcn-id='table-message'>{this.props.messageText}</div>
                     <Spinner id='spinner-datatable-next' display='block' key='bottom' classNames={ 'text-center m-t-10 m-b-10' + (showLoadingSpinner ? ' loading-spinner' : '') }
                             show={this.props.isFetchingNextDataPage}/>
                </div>
            </div>
        );
    },

    DataTableHeader: function() {
        if ( this.props.sortable === true ) {
            return <span className = { 'sortable sort_type_' + this.props.sort } > { this.props.value } < /span>;
        } else {
            return <span> { this.props.value } < /span>;
        }
    }
}
