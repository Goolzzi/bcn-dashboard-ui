jest.dontMock('../src/scripts/stores/Toaster');
jest.dontMock('../src/scripts/constants/ActionTypes');

jest.dontMock('object-assign');
jest.dontMock('lodash');

jest.mock('../src/scripts/dispatchers/AppDispatcher');


describe('Toaster', function () {

	let ActionTypes = require('../src/scripts/constants/ActionTypes')
		.default;

	var callback;
	var sut;
	var AppDispatcher;

	beforeEach(function () {
		sut = require('../src/scripts/stores/Toaster')
			.default;
		//mock the app dispatcher
		AppDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		callback = AppDispatcher.register.mock.calls[0][0];
		sut.emitChange = jest.genMockFunction();
	});

	var getMessageByIndex = (index) => {
		return sut.getMessages()[index];
	};

	var getMessageKeyByIndex = (index) => {
		return sut.getMessages()[index].id;
	};

	var generateToast = (type, text) => {
		callback({
			actionType: ActionTypes.TOAST,
			type: type,
			text: text
		});
	};

	var generateFatToast = (type, text) => {
		callback({
			actionType: ActionTypes.TOAST,
			type: type,
			text: text,
			fat: true
		});
	};

	it('should have 0 toast messages when initalized', function () {
		expect(Object.keys(sut.getMessages())
				.length)
			.toBe(0);
	});

	it('should have 1 toast message when 1 toast generated', function () {
		var errorType = 'error';
		var errorText = 'This is the error message';

		generateToast(errorType, errorText);

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(1);
		expect(messages[0].type)
			.toBe(errorType);
		expect(messages[0].text)
			.toBe(errorText);
	});

	it('should only have 2 toast messages when 2 toasts generated', function () {

		var errorType1 = 'error 1';
		var errorText1 = 'This is the error message 1';
		generateToast(errorType1, errorText1);

		var errorType2 = 'error 2';
		var errorText2 = 'This is the error message 2';
		generateToast(errorType2, errorText2);

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(2);
		expect(messages[0].type)
			.toBe(errorType1);
		expect(messages[0].text)
			.toBe(errorText1);

		expect(messages[1].type)
			.toBe(errorType2);
		expect(messages[1].text)
			.toBe(errorText2);
	});

	it('should discard 1 oldest toast messages when 4 toasts generated', function () {

		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');
		generateToast('error 4', 'This is the error message 3');

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(3);

		expect(messages[0].type)
			.toBe('error 2');
		expect(messages[0].text)
			.toBe('This is the error message 2');
	});

	it('should have 1 toast message and disappear after 8 seconds when 1 toast generated', function () {
		var errorType = 'error';
		var errorText = 'This is the error message';

		generateToast(errorType, errorText);

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(1);
		expect(messages[0].type)
			.toBe(errorType);
		expect(messages[0].text)
			.toBe(errorText);

		expect(setTimeout.mock.calls.length)
			.toBe(1);
		expect(setTimeout.mock.calls[0][1])
			.toBe(8000);

		jest.runAllTimers();
		expect(sut.getMessages()
				.length)
			.toBe(0);
	});

	it('should have 1 toast messages when 2 toasts are generated and remove one is called', function () {
		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(2);

		callback({
			actionType: ActionTypes.TOAST_REMOVE,
			key: messages[0].id
		});

		expect(sut.getMessages()
				.length)
			.toBe(1);
	});

	it('should have 0 toast messages when 3 toasts are generated remove all is called', function () {
		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');

		expect(sut.getMessages()
				.length)
			.toBe(3);

		callback({
			actionType: ActionTypes.TOAST_REMOVE_ALL
		});

		expect(sut.getMessages()
				.length)
			.toBe(0);
	});

	it('should have 2 toast messages when 3 toasts are generated remove type is called', function () {
		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');

		expect(sut.getMessages()
				.length)
			.toBe(3);

		callback({
			actionType: ActionTypes.TOAST_REMOVE_TYPE,
			type: 'error 2'
		});

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(2);
		expect(messages[0].text)
			.toBe('This is the error message 1');
		expect(messages[1].text)
			.toBe('This is the error message 3');
	});


	it('should have 0 toast messages when 3 toasts are generated and AUTH_TOKEN_UNSET is recieved', function () {
		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');

		expect(sut.getMessages()
				.length)
			.toBe(3);

		callback({
			actionType: ActionTypes.AUTH_TOKEN_UNSET
		});

		expect(sut.getMessages()
				.length)
			.toBe(0);
	});

	it('should call emit change when change to store occurs', function () {

		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');
		expect(sut.emitChange.mock.calls.length)
			.toBe(3);

		callback({
			actionType: ActionTypes.TOAST_REMOVE,
			key: getMessageKeyByIndex(0)
		});

		expect(sut.emitChange.mock.calls.length)
			.toBe(4);

		callback({
			actionType: ActionTypes.TOAST_REMOVE_ALL
		});

		expect(sut.emitChange.mock.calls.length)
			.toBe(5);
	});

	it('should remove all dnsquerylog toasts with one emit change when filter delete is called', function () {

		generateToast('dnsquerylog-new', 'This is the error message 1');
		generateToast('dnsquerylog-new', 'This is the error message 2');
		generateToast('dnsquerylog-old', 'This is the error message 3');

		var messages = sut.getMessages();

		expect(sut.emitChange.mock.calls.length)
			.toBe(3);
		expect(messages.length)
			.toBe(2);
		callback({
			actionType: ActionTypes.FILTER_DELETE
		});

		messages = sut.getMessages();

		expect(messages.length)
			.toBe(1);
		expect(messages[0].text)
			.toBe('This is the error message 3');
		expect(sut.emitChange.mock.calls.length)
			.toBe(4);

		generateToast('dnsquerylog-new', 'This is the error message 1');
		generateToast('dnsquerylog-new', 'This is the error message 2');

		messages = sut.getMessages();
		expect(messages.length)
			.toBe(2);
		expect(sut.emitChange.mock.calls.length)
			.toBe(6);

		callback({
			actionType: ActionTypes.FILTER_UPDATE
		});

		messages = sut.getMessages();
		expect(messages.length)
			.toBe(1);
		expect(messages[0].text)
			.toBe('This is the error message 3');
		expect(sut.emitChange.mock.calls.length)
			.toBe(7);

	});

	it('should return true from getApplicationErrorOccured when application error toast generated', function () {

		expect(sut.getApplicationErrorOccured())
			.toBe(false);

		generateToast('application-error', 'This is the error message 1');

		expect(sut.getApplicationErrorOccured())
			.toBe(true);
	});

	it('should remove other toasts when application-error error occurs', function () {
		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');

		expect(sut.getMessages()
				.length)
			.toBe(3);

		generateToast('application-error', 'This is the error message 1');

		expect(sut.getApplicationErrorOccured())
			.toBe(true);


		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(1);
		expect(messages[0].type)
			.toBe('application-error');
	});

	it('should ignore other toast if application-error occured', function () {

		generateToast('application-error', 'This is the error message 1');

		expect(sut.getApplicationErrorOccured())
			.toBe(true);

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(1);
		expect(messages[0].type)
			.toBe('application-error');

		generateToast('error 1', 'This is the error message 1');
		generateToast('error 2', 'This is the error message 2');
		generateToast('error 3', 'This is the error message 3');

		expect(sut.getApplicationErrorOccured())
			.toBe(true);

		var messages = sut.getMessages();
		expect(messages.length)
			.toBe(1);
		expect(messages[0].type)
			.toBe('application-error');

	});

});
