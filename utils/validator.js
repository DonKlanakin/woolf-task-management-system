const securityManager = require("../security/securityManager");

exports.validateParam = (req, res, next, val) => {
	if (Number.isNaN(Number(val)) || Number(val) <= 0) {
		return res.status(400).json({
			status: "failed.",
			requestdAt: req.requestedAt,
			message: "Invalid ID."
		});
	}
	next();
};

exports.validateId = (req, res, next) => {
	let id = req.params.id;
	let isValidId = securityManager.isValidUUID(id)
	if (!isValidId) {
		return res.status(400).json({
			status: "failed.",
			requestdAt: req.requestedAt,
			message: "Invalid ID."
		});
	}
	next();
};
