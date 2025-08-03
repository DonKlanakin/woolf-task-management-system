const pool = require("../db/pool");
const errorHandler = require("../utils/errorHandler");
const securityManager = require("../security/securityManager");

exports.getAllUsers = async (req, res, next) => {
	const logPrefix = "getAllUsers :";
	try {
		let sql = "SELECT * FROM users";
		let servResponse = await pool.query(sql);
		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError("Failed Retrieving users. No entry found.");
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.getUserById = async (req, res, next) => {
	const logPrefix = "getUserById :";
	try {
		let id = req.params.id;
		let sql = `SELECT * from USERS WHERE id = $1`;
		let servResponse = await pool.query(sql, [id]);
		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError(`Failed Retrieving user, ID[${id}] not found.`);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.updateUserById = async (req, res, next) => {
	const logPrefix = "updateUserById :";
	try {
		let id = req.params.id;
		let body = req.body;
		let sql = `UPDATE users SET password = $1
					WHERE id = $2;`;
		let values = [
			await securityManager.processCredentialForStorage(body.credential),
			id
		];
		let servResponse = await pool.query(sql, values);
		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				message: `User information [ID=${id}] has been updated sucessfully.`,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError(`No changes were made, ID[${id}] not found.`);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};
