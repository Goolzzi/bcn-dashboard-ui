import React from 'react';

const ZoomControl = (props) => (
    <div data-bcn-id='zoom-control' className='zoom-control'>
        <button data-bcn-id='zoom-out-control' className='zoom-out'
            disabled={ props.zoomLevel === 2 }
            onClick={ props.onZoomOut }>-</button>
        <button data-bcn-id='zoom-in-control' className='zoom-in'
            disabled={ props.zoomLevel === 15 }
            onClick={ props.onZoomIn }>+</button>
    </div>
);

export default {
    Map: function () {
        return (
            <div className='Map'>
                <div data-bcn-id='googleMap' ref='googleMap' id='google-map'></div>
                <div data-bcn-id='mapProperties' data-bcn-map-zoom-level={ this.state.zoom } data-bcn-map-center={this.state.center} data-bcn-map-bounds={this.state.bounds}></div>
                <ZoomControl
                    zoomLevel={ this.state.zoom }
                    onZoomIn={ this._handleZoomIn }
                    onZoomOut={ this._handleZoomOut } />
            </div>
        );
    }
};
