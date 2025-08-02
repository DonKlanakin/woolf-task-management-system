exports.mapError = (err, req, res, next) => {
	err.status = err.status || "fail";
	err.responseCode = err.responseCode || 500;
	err.message = err.message || `Internal Server Error.`;
	next(err);
};

exports.handlePathNotFound = (req, res, next) => {
	try {
		this.throwPathNotFoundError(null, req, res);
	} catch (err) {
		this.mapError(err, req, res, next);
	}
};

exports.throwPathNotFoundError = (prefix, req, res) => {
	let err = new Error();
	prefix = prefix || "throwPathNotFoundError :";
	err.status = "fail";
	err.responseCode = 404;
	err.message = `URL: ${req.originalUrl} not found.`;
	throw err;
};

exports.throwEntryNotFoundError = (prefix, res) => {
	let err = new Error();
	prefix = prefix || "throwEntryNotFoundError :";
	err.status = "fail";
	err.responseCode = 404;
	err.message = `${prefix} No entry found.`;
	throw err;
};

exports.throwEntityIdNotFoundError = (prefix, id, res) => {
	let err = new Error();
	prefix = prefix || "throwEntityIdNotFoundError :";
	err.status = "fail";
	err.responseCode = 404;
	err.message = `${prefix} ID[${id}] not found.`;
	throw err;
};

exports.throwCreationFailureError = (prefix, res) => {
	let err = new Error();
	prefix = prefix || "throwCreationFailureError :";
	err.status = "fail";
	err.responseCode = 400;
	err.message = `${prefix} No changes were made.`;
	throw err;
};
