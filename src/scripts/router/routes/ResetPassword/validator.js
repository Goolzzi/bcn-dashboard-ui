import _ from 'lodash';

export default function validateInput(data) {
	let errors = {};

	if (_.isEmpty(data.password)) {
		// errors.password = 'This field is required';
	}
	if (_.isEmpty(data.passwordTemp)) {
		// errors.passwordTemp = 'This field is required';
	}
	if (_.isEmpty(data.passwordConfirmation)) {
		// errors.passwordConfirmation = 'This field is required';
	}
	if (!_.isEqual(data.password, data.passwordConfirmation)) {
		errors.passwordConfirmation = 'New Passwords do not match';
	}


	return {
		errors,
		isValid: _.isEmpty(errors)
	}
}
