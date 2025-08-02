const apiErrorHandler = (err, req, res, next) => {
	err.status = err.status || "fail";
	err.responseCode = err.responseCode || 500;
	err.message = err.message || "An error occurred.";
	res.status(err.responseCode).json({
		status: "fail",
		responseCode: err.responseCode,
		message: err.message,
	});
};

module.exports = apiErrorHandler;
