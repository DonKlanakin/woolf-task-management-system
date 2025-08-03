const fs = require("fs");
const pool = require("../db/pool");
const errorHandler = require("../utils/errorHandler");

let data = JSON.parse(fs.readFileSync("./public/students.text"));

exports.createTask = async (req, res, next) => {
	const logPrefix = "createTask :";
	try {
		let body = req.body;
		let sqlCheckDuplicate = `SELECT * FROM tasks WHERE username = $1`;
		let result = await pool.query(sqlCheckDuplicate, [body.username]);
		if (result.rowCount > 0) {
			errorHandler.throwBadRequestError("Task already exists.");
		}
		let sql = `INSERT INTO users (firstname, lastname, email, username, password)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
		let values = [
			body.firstName,
			body.lastName,
			body.email,
			body.username,
			await securityManager.processCredentialForStorage(body.password)
		];
		let servResponse = await pool.query(sql, values);
		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwCreationFailureError(
				"Failed creating a task. No changes were made."
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.getAllTasks = async (req, res, next) => {
	const logPrefix = "getAllTasks :";
	try {
		let sql = "SELECT * FROM tasks";
		let servResponse = await pool.query(sql);
		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError(
				`Failed Retrieving tasks. No entry found.`
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.updateTaskById = async (req, res, next) => {
	const logPrefix = "updateTaskById :";
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
			errorHandler.throwDataNotFoundError(
				`No changes were made, ID[${id}] not found.`
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};
