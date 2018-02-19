function deferred() {
	var obj = {};
	obj.promise = new Promise((resolve, reject) => {
		obj.resolve = resolve;
		obj.reject = reject;
		obj.resolveThen = (value, fn) => {
			resolve(value);
			return obj.promise.then(fn);
		};
		obj.rejectThen = (value, fn) => {
			reject(value);
			return obj.promise.then(() => {
					throw 'expecting failure'
				})
				.catch(fn);
		};
	});

	return obj;
}

export default deferred;
