import React from 'react';
import Tabs from '../../../../../../components/Tabs';
import DataTable from '../../../../../../components/DataTable';
import Toast from  '../../../../../../components/Toast';

export default {
    DataView: function() {
        return (
            <div className='DataView' data-bcn-id="data-view">
                <Tabs active={ this.state.activeTab } items={ this.state.tabItems } />
            </div>
        );
    },

    DataTable: function (tableId, content) {
        return (
            <DataTable key={tableId}
                       tableId={tableId}
                       metadata={this.state.metadata}
                       messageText={content.messageText}
                       data={content.data}
                       numDataAdded={content.numDataAdded}
                       requestNextDataPage={content.requestNextDataPage}
                       requestPrevDataPage={content.requestPrevDataPage}
                       isFetchingPrevDataPage={content.isFetchingPrevDataPage}
                       isFetchingNextDataPage={content.isFetchingNextDataPage}
                       />
        );
    }
};
