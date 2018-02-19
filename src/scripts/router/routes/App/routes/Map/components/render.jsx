import React from 'react'; 
import Map from '../../../../../../components/Map';

export default {
    MapView: function() {
        if ( !this.state.isGoogleMapLoaded ) {
            return (<div/>);
        }

        return (
            <div className='MapView'>
                <Map sites={this.state.sites} />
            </div>
        );
    }
};
