jest.dontMock('../src/scripts/actions/SiteImageDownloadActions');
jest.dontMock('../src/scripts/constants/ActionTypes');

const ActionTypes = require('../src/scripts/constants/ActionTypes')
	.default;
const AppConstants = require('../src/scripts/constants/AppConstants')
	.default;

describe('Sites Image Download Actions', () => {
	let appDispatcher;
	let sut;
	var SiteImageDownloadService;

	var SiteService;
	beforeEach(() => {
		appDispatcher = require('../src/scripts/dispatchers/AppDispatcher');
		SiteImageDownloadService = require('../src/scripts/services/SiteImageDownloadService')
			.default;
		sut = require('../src/scripts/actions/SiteImageDownloadActions')
			.default;
	});

	it('should call SiteImageDownloadService requestSiteImage when requestSiteImage is invoked ', () => {
		var testSiteId = 'testSiteId';
		SiteImageDownloadService.requestSiteImage.mockReturnValue(Promise.resolve(undefined));

		return sut.requestSiteImage(testSiteId)
			.then(resp => {
				expect(appDispatcher.dispatch)
					.toBeCalledWith({
						actionType: ActionTypes.SITEIMAGE_DOWNLOAD_REQUESTED,
						data: {
							siteId: testSiteId
						}
					});

				expect(SiteImageDownloadService.requestSiteImage)
					.toBeCalledWith(testSiteId);

			});
	});

	it('should fail when SiteImageDownloadService fails', () => {
		SiteImageDownloadService.requestSiteImage.mockReturnValue(Promise.reject('fake bad thing happened'));
		return sut.requestSiteImage('testSiteId')
			.then(() => {
				throw 'expecting failure'
			}, () => {});
	});
})
