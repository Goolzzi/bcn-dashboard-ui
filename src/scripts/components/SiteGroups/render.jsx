import React from 'react'; // eslint-disable-line no-unused-vars
import Overlay from '../Overlay';
import DataTable from '../DataTable';
import SiteGroupForm from './SiteGroupForm';
import Autosuggest from 'react-autosuggest';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import FormTextInput from "../FormTextInput";
import FormTextArea from "../FormTextArea";
import Tooltip from 'react-bootstrap/lib/Tooltip';
import { sprintf } from 'sprintf-js';

const Spinner = require('../Spinner').default;

const STRINGS = {
    TOOLTIP_ADMIN_ONLY_ACTION : 'Only an administrator can perform this action.',
    TOOLTIP_RETRIEVING_POLICIES: 'Retrieving policies...',
    TOOLTIP_CREATE_NEW_SITEGROUP: 'Create a new site group.',
    TOOLTIP_EDIT_SITEGROUP: 'Edit site group %1$s.',
    TOOLTIP_RETRIEVING_SITEGROUPS: 'Retrieving site groups...'
};


// When suggestion is clicked, Autosuggest needs to populate the input element
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.siteName;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.description ? (
            <span className="disabled">
                <span className="site_command">
                    <span className="name">{ suggestion.siteName }</span>
                </span>
                <span className="description">{suggestion.description}</span>
            </span>
        ):(
          suggestion.siteId.startsWith('command') ?
              <span className="command">{suggestion.siteName}</span>
          :
              <span className="name">{suggestion.siteName}</span>
        )
    }
  </div>
);

export default {
    SiteGroups: function (localContext) {
        const siteGroupComp = this;
        return <div>
                {siteGroupComp.state.DisplaySiteGroupForm || siteGroupComp.state.currentEditingItem ? null
                                                    : localContext.SiteGroupList.call(siteGroupComp) }


                {siteGroupComp.state.DisplaySiteGroupForm ? (<SiteGroupForm
                                                                formCallback={ siteGroupComp._handleSiteGroupForm} />)
                                                            : null }

                {siteGroupComp.state.currentEditingItem ? (<SiteGroupForm
                                                        formCallback={ siteGroupComp._handleSiteGroupForm}
                                                        siteGroup={ siteGroupComp.state.currentEditingItem } />)
                                                    : null }
            </div>;

    },

    SiteGroupList: function() {
        const breadcrumb = [{title:'Catalog'}, {title:'Site Groups'}];
        const defaultSort = { headerId:'name', sort:'asc' };

        var createSiteGroupDisabled = false;
        var createSiteGroupTooltip = STRINGS.TOOLTIP_CREATE_NEW_SITEGROUP;

        if ( !this.state.isInitialized ) {
            createSiteGroupDisabled = true;
            createSiteGroupTooltip = STRINGS.TOOLTIP_RETRIEVING_SITEGROUPS;
        } else if ( !this.state.isUserAdministrator ) {
            createSiteGroupDisabled = true;
            createSiteGroupTooltip = STRINGS.TOOLTIP_ADMIN_ONLY_ACTION;
        }

        const tooltip = (
             <Tooltip id='tooltip-createsitegroup' className='tooltip-base' data-bcn-id='tooltip-createsitegroup'>
                  { createSiteGroupTooltip }
             </Tooltip>
         );

        return <Overlay
            zIndexClass={this.state.zIndexClass}
            closeHandler={ this._handleOverlayClose }
            isShown = {true}
            breadcrumb = { breadcrumb } >
            <div className={ 'SiteGroups ' }>

                <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
                    <div data-bcn-id='tooltip-container-createsitegroup'
                         className={'button-with-tooltip-container' + (createSiteGroupDisabled ? ' button-with-tooltip-container-disabled':'')}>
                        <button id='btn-add' data-bcn-id='btn-add' type='button' onClick={ this._handleAddButton } disabled={ createSiteGroupDisabled }
                                className='button-with-tooltip btn-base btn btn-small btn-primary add-button btn-form-add' />
                    </div>
                </OverlayTrigger>

                <div className='datatable-container'>
                    <DataTable
                        tableId = "site-groups"
                        numDataAdded = { 0 }
                        defaultSort = { defaultSort }
                        metadata={ this.state.metadata }
                        data={ this.state.isInitialized ? this.state.siteGroups : [] }
                        requestNextDataPage={ ()=>{} }
                        requestPrevDataPage={ ()=>{} }
                        isFetchingPrevDataPage={ false }
                        isFetchingNextDataPage={ !this.state.isInitialized }
                        messageText = {  this.state.isInitialized ? this.state.messageText : null }  />
                  </div>
            </div>
        </Overlay>;
    },

    SiteGroupForm: function () {

        const { value, suggestions, noSuggestions, onlySitesInSiteGroup } = this.state.autoSuggest;

        // Autosuggest will pass through all these props to the input element.
        const inputProps = {
            placeholder: 'Enter a site name',
            value,
            className: 'form-control suggestion-input-box',
            onChange: this._handleSuggestInputChange
        };

        return (
            <Overlay
                    zIndexClass={this.state.zIndexClass}
                    closeHandler={ () => this._closeHandler() }
                    isEditing={ this.state.isEditing }
                    isForm = { this.state.isForm }
                    hasUnsavedChanges = { this.state.hasUnsavedChanges }
                    isShown = { true }
                    opacity = { 1 }
                    isLoading = { this.state.isLoading || this.state.isSubmitting }
                    breadcrumb = { this.state.breadcrumb }
                    className= {"SiteGroupForm input-form"} >
                <br/><br/>
                <div className="row">
                    <div className="col-md-6 form-input-name">
                        <FormTextInput handleInputValueChange= { this._handleSiteGroupNameChange }
                                      value={ this.state.siteGroup.name }
                                      inputValidationMessage= { this.state.nameValidationMessage }
                                      inputLabelText="Name"
                                      placeHolderText="Name your siteGroup"
                                      maxLength={64} />
                    </div>
                    <div className="col-md-5">
                        { this.state.isEditing ?
                            <div className="form-group text-right group-policies-count">
                                <label></label>
                                <p className="form-control-static info-text">
                                    <label>Active Policies</label>
                                    <span className={ this.state.siteGroup.policies.length > 0 ? "white": ""}>{ this.state.siteGroup.policies.length }</span>
                                </p>
                            </div>
                            : null
                        }
                    </div>
                    <div className="col-md-1">
                        <div className="form-input form-group text-right group-site-count">
                            <label></label>
                            <p className="form-control-static info-text">
                                <label>Site Count</label>
                                <span className={ this.state.siteGroup.sites.length > 0 ? "white": ""}>{ this.state.siteGroup.sites.length }</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 form-input-description">
                        <FormTextArea handleInputValueChange= { this._handleSiteGroupDescriptionChange }
                                      value={ this.state.siteGroup.description }
                                      inputValidationMessage= { this.state.descriptionValidationMessage }
                                      resize= { false }
                                      inputLabelText="Description"
                                      placeHolderText="Enter a description for this siteGroup"
                                      maxLength={ 256 } />
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-input form-group autosuggest-container">
                            <label></label>
                            <Autosuggest
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    onSuggestionSelected = {this.onSuggestionSelected}
                                    getSuggestionValue={getSuggestionValue}
                                    renderSuggestion={renderSuggestion}
                                    suggestions={ suggestions }
                                    focusFirstSuggestion={ true }
                                    inputProps= { inputProps }  />
                            { onlySitesInSiteGroup ?

                                <div id="react-autowhatever-1" className="react-autosuggest__suggestions-container ">
                                    <ul role="listbox" className="react-autosuggest__suggestions-list no-suggestions">
                                        <li role="option" id="react-autowhatever-1--item-0" className="react-autosuggest__suggestion" data-suggestion-index="0">
                                            A SITE CAN ONLY BE ASSOCIATED TO ONE SITE GROUP
                                        </li>
                                    </ul>
                                </div>
                                : null
                            }
                            { noSuggestions ?

                                <div id="react-autowhatever-1" className="react-autosuggest__suggestions-container ">
                                    <ul role="listbox" className="react-autosuggest__suggestions-list invalid-suggestions">
                                        <li role="option" id="react-autowhatever-1--item-0" className="react-autosuggest__suggestion" data-suggestion-index="0">
                                            NO MATCHING SITE CAN BE FOUND
                                        </li>
                                    </ul>
                                </div>
                                : null
                            }
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="group_sites">
                    { this.state.siteGroup && this.state.siteGroup.sites.length > 0 ?
                        this.state.siteGroup.sites.map((site, i) => {
                                if( !site ) {
                                    return;
                                }
                            return <div data-bcn-id='added-site' className={"col-xs-12 col-sm-6 col-md-4 col-lg-3 " + (site.siteId === this.state.highlightedSiteId ? 'highlight': '')} key={i} id={site.siteId}>
                                        <div className="icon_wrap">
                                            <span className="fa fa-times-thin remove-site" onClick={this.removeSite.bind(this, site)} ></span>
                                        </div>
                                        <div className="name_wrap">
                                            { site.siteName ? site.siteName : site.siteId }
                                        </div>
                                    </div>;
                        })
                    :
                        <div className="empty">
                            This siteGroup is currently empty.<br/>Enter site names above to add them to this group.
                        </div>
                    }
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">

                    </div>
                    <div className="col-sm-6 text-right">
                        <div className={"btn save-btn " + (this.state.hasUnsavedChanges ? "active": "")} onClick={ this._saveHandler.bind(null, this.state.siteGroup) }>Save</div>
                    </div>
                </div>
                { this.state.isEditing ?
                    <span className="fa fa-trash-o delete-btn" onClick={this._deleteSiteGroup} > </span>
                    : null
                }
            </Overlay>
            );
    },

    DownloadEdit: function (handlerContext, SiteGroupsComponent, item){
      return <button data-bcn-id='btn-edit-siteGroup' className='btn-noborder-edit btn-edit-image' onClick={ SiteGroupsComponent._handleSiteGroupEdit.bind(null, item) } />;
	},

    EditSiteGroup: function (siteGroup,
                             clickCallback,
                             isAdministrator) {

        var isDisabled = false;
        var tooltipText = sprintf(STRINGS.TOOLTIP_EDIT_SITEGROUP, siteGroup.name);

        if ( !isAdministrator ) {
            isDisabled = true;
            tooltipText = STRINGS.TOOLTIP_ADMIN_ONLY_ACTION;
        }

        const tooltip = (
             <Tooltip id='tooltip-editsitegroup' className='tooltip-base' data-bcn-id='tooltip-editsitegroup'>
                { tooltipText }
             </Tooltip>
           );

        return <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
                    <div data-bcn-id={ 'tooltip-container-editsitegroup' }
                         className={'button-with-tooltip-container' + (isDisabled ? ' button-with-tooltip-container-disabled':'')}>
                        <button data-bcn-id='btn-edit-siteGroup'
                                className='button-with-tooltip btn-base btn btn-noborder-edit btn-edit-image'
                                onClick={ clickCallback }
                                disabled={ isDisabled } />
                    </div>
              </OverlayTrigger>;
    },

    PolicyLoading: function(handlerContext, siteGroup){
      const tooltip = (
           <Tooltip id='tooltip-policywait' className='tooltip-base' data-bcn-id='tooltip-policywait'>
                Retrieving policies...
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
