const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");

dotenv.config({ path: "./configs/config.env" });

exports.processCredentialForStorage = async (providedCred) => {
	const logPrefix = "processCredentialForStorage :";
	let hash = "";
	try {
		hash = await bcrypt.hash(providedCred, 12);
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
	}
	return hash;
};

exports.validateCredential = async (providedCred, hash) => {
	const logPrefix = "validateCredential :";
	let result = "";
	try {
		result = await bcrypt.compare(providedCred, hash);
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
	}
	return result;
};

exports.issueToken = async (payload) => {
	const logPrefix = "issueToken :";
	try {
		const activePeriod = 60 * 60;
		const secretkey = process.env.JWT_SECRET_KEY;
		return jwt.sign(payload, secretkey, { expiresIn: activePeriod });
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		return res.status(500).json({
			status: "fail",
			message: "An error occurred during token issuing."
		});
	}
};

exports.verifyToken = (req, res, next) => {
	const logPrefix = "varifyToken :";
	if (!req.headers.authorization) {
		errorHandler.throwAuthorizationFailureError("Authentication failed.");
	}
	const tokenParts = req.headers.authorization.split(" ");
	if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
		errorHandler.throwAuthorizationFailureError(
			`Authorization failed due to invalid authentication header format. It must be "Bearer <token>."`
		);
	}
	try {
		const token = tokenParts[1];
		const secretKey = process.env.JWT_SECRET_KEY;
		req.auth = jwt.verify(token, secretKey);
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
	next();
};

exports.verifyOperatorLevelClearance = (req, res, next) => {
	const logPrefix = "verifyOperatorLevelClearance :";
	const role = req.auth.role;
	try {
		if (role === "operator" || role === "admin") {
			return next();
		} else {
			errorHandler.throwForbiddenActionError("Permission denied.");
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.verifyAdminLevelClearance = (req, res, next) => {
	const logPrefix = "verifyAdminLevelClearance :";
	const role = req.auth.role;
	try {
		if (role === "admin") {
			return next();
		} else {
			errorHandler.throwForbiddenActionError("Permission denied.");
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.isValidUUID = (id) => {
	const uuidRegex =
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
	return uuidRegex.test(id);
};
