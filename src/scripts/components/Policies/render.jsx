import React from 'react'; // eslint-disable-line no-unused-vars
import Overlay from '../Overlay';
import DataTable from '../DataTable';
import Autosuggest from 'react-autosuggest';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import { sprintf } from 'sprintf-js';
const Spinner = require('../Spinner').default;

const STRINGS = {
    TOOLTIP_ADMIN_ONLY_ACTION : 'Only an administrator can perform this action.',
    TOOLTIP_CREATE_NEW_POLICY: 'Create a new policy.',
    TOOLTIP_EDIT_POLICY: 'Edit policy %1$s.',
    TOOLTIP_RETRIEVING_POLICIES: 'Retrieving policies...'
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
                <span className="site_command">site: <span className="name">{suggestion.siteName}</span></span>
                <span className="description">{suggestion.description}</span>
            </span>
        ):
        <span className="site_command">site: <span className="name">{suggestion.siteName}</span></span> }
  </div>
);

export default {
    Policies: function (localContext) {
        const policyComp = this;
        return <div>
                {policyComp.state.DisplayPolicyForm || policyComp.state.currentEditingItem ? null
                                                    : localContext.PolicyList.call(policyComp) }


                {policyComp.state.DisplayPolicyForm ? (<PolicyForm
                                                                formCallback={ policyComp._handlePolicyForm} />)
                                                            : null }

                {policyComp.state.currentEditingItem ? (<PolicyForm
                                                        formCallback={ policyComp._handlePolicyForm}
                                                        policy={ policyComp.state.currentEditingItem } />)
                                                    : null }
            </div>;

    },

    PolicyList: function() {
        const breadcrumb = [{title:'Catalog'}, {title:'Policies'}];
        const tableMetadata = this.state.metadata;
        const policyComp = this;
        const defaultSort = { headerId:'name', sort:'asc'};

        var createPolicyDisabled = false;
        var createPolicyTooltip = STRINGS.TOOLTIP_CREATE_NEW_POLICY;

        if ( !this.state.isInitialized ) {
            createPolicyDisabled = true;
            createPolicyTooltip = STRINGS.TOOLTIP_RETRIEVING_POLICIES;
        } else if ( !this.state.isUserAdministrator ) {
            createPolicyDisabled = true;
            createPolicyTooltip = STRINGS.TOOLTIP_ADMIN_ONLY_ACTION;
        }

        const tooltip = (
             <Tooltip id='tooltip-createpolicy' className='tooltip-base' data-bcn-id='tooltip-createpolicy'>
                  { createPolicyTooltip }
             </Tooltip>
         );

        return <div>
                <Overlay
                    zIndexClass={this.state.zIndexClass}
                    closeHandler={ this._handleOverlayClose }
                    isShown = {true}
                    breadcrumb = { breadcrumb } >
                    <div className={ 'Policies ' }>

						<OverlayTrigger animation={true} placement='right' overlay={tooltip}>
							<div data-bcn-id='tooltip-container-createpolicy'
							   className={'button-with-tooltip-container' + (createPolicyDisabled ? ' button-with-tooltip-container-disabled':'')}>
							   <button id='btn-add' data-bcn-id='btn-add' type='button' onClick={ this._handleAddButton } disabled={ createPolicyDisabled }
							          className='button-with-tooltip btn-base btn btn-small btn-primary add-button btn-form-add' />
							</div>
						</OverlayTrigger>

                        <DataTable
                            tableId = "policies"
                            numDataAdded = { policyComp.state.numDataAdded }
                            defaultSort = { defaultSort }
                            metadata={ tableMetadata }
                            data={ policyComp.state.isInitialized ? policyComp.state.policies : []}
                            requestNextDataPage={ policyComp._requestNextDataPage }
                            requestPrevDataPage={ policyComp._requestPrevDataPage }
                            isFetchingPrevDataPage={ false }
                            isFetchingNextDataPage={ !policyComp.state.isInitialized }
                            sortingCallback = { policyComp._handleSorting }
                            messageText = { policyComp.state.messageText }   />
                    </div>
                </Overlay>
            </div>;
    },

    PolicyForm: function () {

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

    DownloadEdit: function (handlerContext, item){
      return <button data-bcn-id='btn-edit-policies' className='btn-noborder-edit btn-edit-image' />;
    },

    PolicyActive: function (handlerContext, statusText){
      return (
        <button data-bcn-id='img-active-policy'  className='btn-noborder-policy btn-active-image' >
        {statusText}
        </button>
      );
    },

    PolicyInactive: function (handlerContext, statusText){
      return (
        <button data-bcn-id='img-inactive-policy' className='btn-noborder-policy btn-inactive-image' >
        {statusText}
        </button>
      );
    },

    PolicyMonitor: function (handlerContext, item){
      const tooltip = (
           <Tooltip id='tooltip-monitor-policy' className='tooltip-base' data-bcn-id='tooltip-monitor-policy'>
              Watching Policy
           </Tooltip>
         );
      const action = item.action.type;
      return (
        <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
        <button data-bcn-id='img-monitor-policy' className='btn-noborder-policy btn-monitor-image'>
        {action}
        </button>
        </OverlayTrigger>
      );
    },

    PolicyBlock: function (handlerContext, item){
      const tooltip = (
           <Tooltip id='tooltip-blocking-policy' className='tooltip-base' data-bcn-id='tooltip-blocking-policy'>
              Blocking Policy
           </Tooltip>
         );
      const action = item.action.type;
      return (
        <OverlayTrigger animation={true} placement='right' overlay={tooltip}>
        <button data-bcn-id='img-blocking-policy' className='btn-noborder-policy btn-block-image'>
        {action}
        </button>
        </OverlayTrigger>
      );
    }
};
