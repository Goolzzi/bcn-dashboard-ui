import React from 'react';
import Toast from '../../../../components/Toast';
import Settings from '../../../../components/Settings';
import CommandBar from '../../../../components/CommandBar';
import CommandBarPresenter from '../../../../components/CommandBar/CommandBarPresenter.js';
import SiteGroups from '../../../../components/SiteGroups';
import ProfileScreen from '../../../../components/ProfileScreen';
import Sites from '../../../../components/Sites';
import Policies from '../../../../components/Policies';
import DomainLists from '../../../../components/DomainLists';

export default {

    getView: function(){
      switch(this.state.currentPage){
        case '/sitegroups' :
          return <SiteGroups />;
        case '/sites' :
          return <Sites />;
        case '/policies' :
          return <Policies />;
        case '/domainlists' :
          return <DomainLists />;
        default:
          return;
      }
    },


    App: function(localContext) {
        return (
            <div className='AppContainer' onKeyDown={ this._handleKeyDown } onMouseDown={ this._handleMouseDown } onWheel={ this._handleWheel }>
                { this.state.hasApplicationError && <div data-bcn-id='application-error-overlay' className="modal-backdrop app-error-overlay"></div> }
                <Toast />
                <Settings />
                { this.headerComponent }
                <div className='command-bar-repositioner'>
                	<CommandBar router={ this.context.router } presenter={CommandBarPresenter} />
                </div>
                {localContext.getView.call(this)}
                <ProfileScreen />
                { this.childComponent }
            </div>
        );
    }
};
