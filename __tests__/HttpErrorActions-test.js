'use strict';

jest.dontMock('../src/scripts/actions/HttpErrorActions');
jest.dontMock('../src/scripts/constants/ActionTypes');
const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;

describe('HttpError Actions', () => {

	let appDispatcher;
	let sut;

	beforeEach(() => {
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		sut = require('../src/scripts/actions/HttpErrorActions')
			.default;
	})

	it('should verify the dispatcher gets called when response has error 400 ', () => {
		var response = {
			status: 400,
			responseText: '{ "errors": "blah blah" }'
		};
		sut.dispatch(response);
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.ERROR_400,
				errors: 'blah blah'
			})
		//expect(appDispatcher.dispatch).toBeCalled();
	})


	it('should verify the dispatcher gets called when response has error 403 ', () => {
		var response = {
			status: 403,
			responseText: '{ "errors": "blah blah" }'
		};
		sut.dispatch(response);
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.ERROR_403,
				errors: 'blah blah'
			})
	})


	it('should verify the dispatcher gets called when response has error 403 ', () => {
		var response = {
			status: 404,
			responseText: '{ "errors": "blah blah" }'
		};
		sut.dispatch(response);
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.ERROR_404,
				errors: 'blah blah'
			})
	})

	it('should verify the dispatcher gets called when response has error 500 ', () => {
		var response = {
			status: 500,
			responseText: '{ "errors": "blah blah" }'
		};
		sut.dispatch(response);
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.ERROR_5XX,
				errors: 'blah blah'
			})
	})

	it('should verify the dispatcher gets called when response has error and no respone text ', () => {
		var response = {
			status: 400,
			responseText: null
		};
		var errors = [{
			message: 'An error has occured while fetching data from the server.'
		}];
		sut.dispatch(response);
		expect(appDispatcher.dispatch)
			.toBeCalledWith({
				actionType: ActionTypes.ERROR_400,
				errors: errors
			})
	})

})
