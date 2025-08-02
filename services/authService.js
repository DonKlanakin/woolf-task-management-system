const pool = require("../db/pool");
const errorHandler = require("../utils/errorHandler");
const securityManager = require("../security/securityManager");

exports.registerUser = async (req, res, next) => {
	const logPrefix = "registerUser :";
	try {
		let body = req.body;
		let sqlCheckDuplicate = `SELECT * FROM users WHERE email = $1`;
		let result = await pool.query(sqlCheckDuplicate, [body.email]);
		if (result.rowCount > 0) {
			return res.status(400).json({
				status: "fail",
				responseCode: "400",
				message: "User with this email already exists."
			});
		}
		let sql = `INSERT INTO users (name, email, password)
                    VALUES ($1, $2, $3) RETURNING *;`;
		let values = [
			body.name,
			body.email,
			await securityManager.processCredentialForStorage(body.credential)
		];
		let servResponse = await pool.query(sql, values);
		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwCreationFailureError("Failed creating a user.", res);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.loginUser = async (req, res, next) => {
	const logPrefix = "loginUser :";
	try {
		// SQL Query
		let body = req.body;
		let sql = `SELECT * FROM users
					WHERE email = $1`;
		let values = [body.email];
		let servResponse = await pool.query(sql, values);
		if (servResponse.rowCount <= 0) {
			return res.status(401).json({
				status: "fail",
				message: "Invalid username or password."
			});
		}

		// User Authentication
		let resData = servResponse.rows[0];
		let providedCred = body.credential;
		let storedCred = resData.password;
		let isValidCredential = await securityManager.validateCredential(
			providedCred,
			storedCred
		);
		if (isValidCredential) {
			let token = await securityManager.issueToken({
				id: resData.id,
				email: resData.email,
				role: resData.role
			});
			return res.status(200).json({
				status: "success",
				message: "User authenticated.",
				userId: resData.id,
				token: token
			});
		} else {
			return res.status(401).json({
				status: "fail",
				message: "Invalid password."
			});
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};
