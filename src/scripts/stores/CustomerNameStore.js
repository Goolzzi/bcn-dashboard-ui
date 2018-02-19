/**
 * CustomerName store
 * @module CustomerNameStore
 */
var CustomerNameStore = Object.assign({}, {

	/**
	 * Get customer name
	 * @return {Object}
	 */
	getCustomerName: function () {
		if (window.customerName != null && window.customerName != 0) {
			return window.customerName;
		} else {
			return '';
		}
	}
});

export default CustomerNameStore;
