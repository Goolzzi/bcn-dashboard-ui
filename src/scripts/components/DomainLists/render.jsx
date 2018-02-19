import React from 'react'; // eslint-disable-line no-unused-vars
import Overlay from '../Overlay';
import DataTable from '../DataTable';
import Autosuggest from 'react-autosuggest';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
const Spinner = require('../Spinner').default;

export default {
    DomainLists: function () {
        const breadcrumb = [{title:'Catalog'}, {title:'Domain Lists'}];
        const tableMetadata = this.state.metadata;
        const domainListComp = this;
        const defaultSort = { headerId:'name', sort:'asc'};
        return <div>
                <Overlay
                    zIndexClass={this.state.zIndexClass}
                    closeHandler={ this._handleOverlayClose }
                    isShown = {true}
                    breadcrumb = { breadcrumb } >
                    <div className={ 'DomainLists ' }>
                        <DataTable
                            tableId = "domain-lists"
                            numDataAdded = { domainListComp.state.numDataAdded }
                            defaultSort = { defaultSort }
                            metadata={ tableMetadata }
                            data={ domainListComp.state.isInitialized ? domainListComp.state.domainLists : []}
                            requestNextDataPage={ domainListComp._requestNextDataPage }
                            requestPrevDataPage={ domainListComp._requestPrevDataPage }
                            isFetchingPrevDataPage={ false  }
                            isFetchingNextDataPage={ !domainListComp.state.isInitialized }
                            sortingCallback = { domainListComp._handleSorting }
                            messageText = { domainListComp.state.messageText }   />
                    </div>
                </Overlay>
            </div>;
    },

    DownloadEdit: function (handlerContext, item){
      return <button data-bcn-id='btn-edit-domain-list' className='btn-noborder-edit btn-edit-image' />;
    },

    PolicyLoading: function(handlerContext, item){
      const tooltip = (
           <Tooltip id='tooltip-policywait' className='tooltip-base' data-bcn-id='tooltip-policywait'>
                Retrieving active policies...
           </Tooltip>
         );

      return (
        <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
        <button className='btn-noborder-policywait'>
        <Spinner display='table' policyload={true} key='bottom' divClassNames='policy-spinner' classNames='btn-noborderspin'
                    show={true}  data-bcn-id='policy-count-fetching'/>
        </button>
        </OverlayTrigger>
        );
    }
};
