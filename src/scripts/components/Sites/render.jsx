import React from 'react';
import Overlay from '../Overlay';
import EditableTable from '../EditableTable';
import SiteImageStatus from '../../constants/SiteImageStatus';
import moment from 'moment';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
const Spinner = require('../Spinner').default;

export default {
    Sites: function() {
        const breadcrumb = [{title:'Catalog'}, {title:'Sites'}];
        return <div>
          <Overlay
             zIndexClass={this.state.zIndexClass}
             closeHandler={ this._handleOverlayClose }
             isShown = {true}
             breadcrumb = { breadcrumb } >
             <div className='Sites ' data-bcn-id='view-sites'>
                 <div className='content'>
                     <div className='data'>
                          <EditableTable key='sites'
                                        tableId='sites'
                                        metadata={this.state.metadata}
                                        messageText={this.state.messageText}
                                        data={this.state.sites}
                                        validateData={this._validateNewSiteData}
                                        newData={this.state.newData}
                                        handleOnChange={this._handleOnChange}
                                        handleOnClear={this._handleOnClear}
                                        isSubmitting={this.state.isSubmitting}
                                        isFetchingData={this.state.isFetchingData}
                           			        actionContext={this} />
                     </div>

                 </div>
             </div>
          </Overlay>
        </div>;
    },

    DownloadAction: function(handlerContext, item, imageInfo,editingSiteId) {
    	if(item.siteId == editingSiteId) {
    		return this.AddActionColumn(handlerContext,item);
    	}
        if ( imageInfo.status === SiteImageStatus.NOT_FOUND ) {
            return this.DownloadSiteButton(handlerContext, item);
        } else if ( imageInfo.status === SiteImageStatus.IN_PROGRESS ) {
            return this.GeneratingSiteImage(handlerContext, item);
        } else if ( imageInfo.status === SiteImageStatus.COMPLETED ) {
            return this.SiteImageDownloadLink(handlerContext, item, imageInfo.link, imageInfo.timeOfExpiry)
        } else if ( imageInfo.status === SiteImageStatus.FAILED ) {
            return this.ErrorDownloadSiteButton(handlerContext, item)
        }

    },

    ErrorDownloadSiteButton: function(handlerContext, item) {
        const tooltip = (
          <Tooltip id='tooltip-download-error' className='tooltip-base' data-bcn-id='tooltip-download-error'>
              <strong>Download currently unavailable. Please try later.</strong>
          </Tooltip>
        );

        const tooltipedit = (
          <Tooltip id='tooltip-download-error' className='tooltip-base' data-bcn-id='tooltip-download-error'>
              <strong>Edit Forwarding DNS.</strong>
          </Tooltip>
        );

        return (
        <div>
        <OverlayTrigger animation={true} placement='right' overlay={tooltipedit}>
             <button data-bcn-id='btn-edit-dns'
                    className='btn-noborder-edit btn-edit-image'
                    onClick={ () => handlerContext._handleEditDNSSettings(item)}/>
                    </OverlayTrigger>
            <OverlayTrigger delayHide={0} animation={false} placement='right' overlay={tooltip}>
            <button data-bcn-id='btn-siteimage-action'
                    className='btn-noborder-download btn-failed-gen-image'/>
            </OverlayTrigger>
            </div>
        );
    },

    DownloadSiteButton: function(handlerContext, item) {
        const tooltip = (
          <Tooltip id='tooltip-download' className='tooltip-base' data-bcn-id='tooltip-download'>
              <strong>Request download link</strong>
          </Tooltip>
        );
		 const tooltipedit = (
          <Tooltip id='tooltip-download-error' className='tooltip-base' data-bcn-id='tooltip-download-error'>
              <strong>Edit Forwarding DNS.</strong>
          </Tooltip>
        );

        return (
             <div>
             <OverlayTrigger animation={true} placement='right' overlay={tooltipedit}>
             <button data-bcn-id='btn-edit-dns'
                    className='btn-noborder-edit btn-edit-image'
                    onClick={ () => handlerContext._handleEditDNSSettings(item)}/>
             </OverlayTrigger>
            <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
            <button data-bcn-id='btn-siteimage-action'
                    className='btn-noborder-download btn-genlink-image'
                    onClick={ () => handlerContext._handleDownloadSiteImage(item) }/>
            </OverlayTrigger>
         	</div>
        );
    },

    GeneratingSiteImage: function(handlerContext, item) {
     const tooltip = (
          <Tooltip id='tooltip-download' className='tooltip-base' data-bcn-id='tooltip-download'>
               Generating link..
                <p><strong>THIS MAY TAKE A FEW MINUTES</strong></p>
          </Tooltip>
        );
         const tooltipedit = (
          <Tooltip id='tooltip-download-error' className='tooltip-base' data-bcn-id='tooltip-download-error'>
              <strong>Edit Forwarding DNS.</strong>
          </Tooltip>
        );

        return (
            <div >
            <OverlayTrigger animation={true} placement='right' overlay={tooltipedit}>
                <button data-bcn-id='btn-edit-dns'
                    className='btn-noborder-edit btn-edit-image'
                    onClick={ () => handlerContext._handleEditDNSSettings(item)}/>
            </OverlayTrigger>
            <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
                <button className='btn-noborder-download'>
                    <Spinner display='inline' key='bottom' divClassNames='download-spinner' classNames='btn-noborderspin'
                        show={true} data-bcn-id='siteimage-generating'/>
            </button>
            </OverlayTrigger>

            </div>
        );
    },

    SiteImageDownloadLink: function(handlerContext, item, link, timeOfExpiry) {
        var dayString = 'TODAY';
        var momentExpiry = moment( new Date().setTime(timeOfExpiry * 1000) );
        var timeExpiryDisplay = momentExpiry.format('HH:mm');

        if ( moment({hour: 23, minute: 59, seconds: 59}).diff(momentExpiry) < 0 ) {
            dayString = 'TOMORROW';
        }

        const tooltip = (
          <Tooltip id='tooltip-download' className='tooltip-base' data-bcn-id='tooltip-download'>
            <p><strong>EXPIRES <span>{dayString}</span> AT <span>{timeExpiryDisplay}</span></strong></p>
          </Tooltip>
        );

         const tooltipedit = (
          <Tooltip id='tooltip-download-error' className='tooltip-base' data-bcn-id='tooltip-download-error'>
              <strong>Edit Forwarding DNS.</strong>
          </Tooltip>
        );


        return (
            <div>
            <OverlayTrigger animation={true} placement='right' overlay={tooltipedit}>
             <button data-bcn-id='btn-edit-dns'
             		className='btn-noborder-edit btn-edit-image'
             		onClick={ () => handlerContext._handleEditDNSSettings(item)}/>
             </OverlayTrigger>
              <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
              <a href={link} download>
              <button data-bcn-id='btn-download-action'
                    className='btn-noborder-download btn-download-image' />
               </a>
              </OverlayTrigger>
            </div>
        );
    },

    AddTextBoxAction: function(handlerContext, item, defaultDNSIP, forwarding_dns_ip, message) {
    return(
    <div className='edit-text-field '>

    <input type='text' data-bcn-id='edit-dns-box' className='form-control' placeholder={defaultDNSIP} value={forwarding_dns_ip}
    	onChange={handlerContext._handleDNSEditOnChange}/>
    	  <div className='validation-error' data-bcn-id='validation-dnserror-message'>{message}</div>

     </div>

    );
    },

    DefaultFordwaringIp: function(ip) {
    return(
    	<i>
    	{ip}
    	</i>
    );
    },


     AddActionColumn : function(handlerContext,item) {
        return (
           		<div>

               <button data-bcn-id='btn-add-save' type='submit'
                        className='btn-base btn-small btn-primary btn-table-save'
                        onClick={ () => handlerContext._handleDNSUpdateSettings(item) }/>
                <button data-bcn-id='btn-add-clear' type='reset'
                        className='btn-base btn-small btn-default btn-table-clear'
                        onClick={ () => handlerContext._handleDNSEditClear() }/>

           </div>
        );
    }
};
