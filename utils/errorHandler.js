exports.mapError = (err, req, res, next) => {
	err.status = err.status || "fail";
	err.responseCode = err.responseCode || 500;
	err.message = err.message || `Internal Server Error.`;
	next(err);
};

exports.handlePathNotFound = (req, res, next) => {
	try {
		this.throwPathNotFoundError(`URL: ${req.originalUrl} not found.`);
	} catch (err) {
		this.mapError(err, req, res, next);
	}
};

exports.throwBadRequestError = (message, req, res) => {
	const err = new Error();
	err.status = "fail";
	err.responseCode = 400;
	err.message = message || "Invalid request data";
	throw err;
}

exports.throwCreationFailureError = (message, req, res) => {
	const err = new Error();
	err.status = "fail";
	err.responseCode = 400;
	err.message = message || "Creation failure.";
	throw err;
};

exports.throwAuthorizationFailureError = (message, req, res) => {
	const err = new Error();
	err.status = "fail";
	err.responseCode = 401;
	err.message = message || "Authorization failure.";
	throw err;
}

exports.throwForbiddenActionError = (message, req, res) => {
	const err = new Error();
	err.status = "fail";
	err.responseCode = 403;
	err.message = message || "Forbidden activity.";
	throw err;
}

exports.throwPathNotFoundError = (message, req, res) => {
	const err = new Error();
	err.status = "fail";
	err.responseCode = 404;
	err.message = message || "Path not found.";
	throw err;
};

exports.throwDataNotFoundError = (message, req, res) => {
	const err = new Error();
	err.status = "fail";
	err.responseCode = 404;
	err.message = message || "Data not found.";
	throw err;
};
