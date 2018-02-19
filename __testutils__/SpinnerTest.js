import React from 'react';

var Spinner = React.createClass({
	propTypes: {
		classNames: React.PropTypes.string,
		show: React.PropTypes.bool.isRequired,
		center: React.PropTypes.bool,
		display: React.PropTypes.string
	},

	render: function () {
		return ( <
			div className = "Spinner" >
			Spinner <
			/div>
		);
	}
});

export default Spinner;
