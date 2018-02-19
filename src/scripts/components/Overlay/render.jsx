import React from 'react';
const Spinner = require('../Spinner').default;

export default {
    Overlay: function () {
    	const title = this.props.breadcrumb.length > 0 ? this.props.breadcrumb[this.props.breadcrumb.length-1].title : '';
    	const noOfCrumbs = this.props.breadcrumb.length > 1 ? this.props.breadcrumb.length-1 : 0;
    	const crumbs = [];
    	for (var i = 0; i < noOfCrumbs; i++) {
    		crumbs.push(this.props.breadcrumb[i]);
    	}

        return (
            <div data-bcn-id='Overlay' className={ (this.props.className ? this.props.className: '') + ' Overlay z-index-'+ (this.props.zIndexClass) + (this.props.isShown ? ' active': '')}
            		style={ this.props.opacity && this.props.opacity>0 ? {opacity: this.props.opacity}: {} }>
                <Spinner id='overlay-spinner' display='block' key='top' classNames= {'text-center ' + (this.props.isLoading? 'active':'') } divClassNames='overlay-spinner'
                         show={this.props.isLoading ? true : false}/>
                <div className="actions-wrap">

	                { this.props.isForm ? (
	                	<div>
			                <div data-bcn-id='btn-close-overlay' className='close-btn' onClick={ this.props.closeHandler }>
			                    <i className='fa fa-ban'></i>
                                <span className={ this.props.hasUnsavedChanges ? "show": "hide"}>unsaved changes</span>
			                </div>
		                </div>
	                ) : (
		                <div data-bcn-id='btn-close-overlay' className='close-button' onClick={ this.props.closeHandler }></div>
	                ) }

                </div>
                <div className="content-wrap">
                    <h3>{title}
                    		<span>
                                { this.props.closeHandler ?
    	                    		<span className="back-button fa fa-angle-left" onClick={ this.props.closeHandler } ></span>
                                    : null
                                }

                                {crumbs.length > 0 &&
    		                    	<span className="highlighted">
    			                    	{crumbs.length > 0 &&
    			                    		crumbs.map( (obj, i ) => {
    				                    		return <span key={i}>{obj.title + (crumbs.length-1 != i ? ' / ': '')}</span>
    				                    	})
    			                    	}
    		                    	</span>
                                }
	                    	</span>

                	</h3>

                    <div className='data-wrap'>
                    	{this.props.children}
                    </div>
                </div>
            </div>
        );
    }
};
