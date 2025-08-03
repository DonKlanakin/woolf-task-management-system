const pool = require("../db/pool");
const errorHandler = require("../utils/errorHandler");

exports.getAllTasks = async (req, res, next) => {
	const logPrefix = "getAllTasks :";
	try {
		const userId = req.auth.id;
		let sql = `SELECT * FROM tasks WHERE "assigned_to" = $1 ORDER BY due_date ASC`;
		let servResponse = await pool.query(sql, [userId]);

		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError(
				"Failed Retrieving tasks. No tasks found."
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.getTaskById = async (req, res, next) => {
	const logPrefix = "getTaskById :";
	try {
		let id = req.params.id;
		const userId = req.auth.id;
		const userRole = req.auth.role;

		// Only the owner OR an admin can retrive the task.
		let sql = `SELECT * FROM tasks WHERE id = $1 AND ("assigned_to" = $2 OR $3 = 'admin')`;
		let servResponse = await pool.query(sql, [id, userId, userRole]);

		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError(
				`Failed Retrieving task, ID[${id}] not found.`
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.createTask = async (req, res, next) => {
	const logPrefix = "createTask :";
	try {
		let body = req.body;
		const userId = req.auth.id;

		// Assign task to the logged-in user
		let sql = `INSERT INTO tasks (title, description, status, "assigned_to", "due_date")
                   VALUES ($1, $2, $3, $4, $5) RETURNING *`;
		let values = [
			body.title,
			body.description,
			body.status || "pending",
			userId,
			body.due_date
		];

		let servResponse = await pool.query(sql, values);

		if (servResponse.rowCount > 0) {
			res.status(201).json({
				status: "success",
				message: "Task has been created successfully.",
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwDataNotFoundError("Failed to create task.");
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
		const userId = req.auth.id;
		const userRole = req.auth.role;
		const fields = Object.keys(body).map((key, index) => `"${key}" = $${index + 1}`);
		const values = Object.values(body);
		values.push(id, userId, userRole);

		// Check if the logged-in user is the owner or an admin.
		let sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${values.length - 2} AND ("assigned_to" = $${values.length - 1} OR $${values.length} = 'admin') RETURNING *;`;
		let servResponse = await pool.query(sql, values);

		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				message: `Task [ID=${id}] has been updated successfully.`,
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwForbiddenActionError(
				`Forbidden activity. No changes were made.`
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};

exports.deleteTaskById = async (req, res, next) => {
	const logPrefix = "deleteTaskById :";
	try {
		let id = req.params.id;
		const userId = req.auth.id;
		const userRole = req.auth.role;

		// Check if the logged-in user is the owner or an admin.
		let sql = `DELETE FROM tasks WHERE id = $1 AND ("assigned_to" = $2 OR $3 = 'admin') RETURNING *`;
		let servResponse = await pool.query(sql, [id, userId, userRole]);

		if (servResponse.rowCount > 0) {
			res.status(200).json({
				status: "success",
				message: `Task [ID=${id}] has been deleted successfully.`,
				requestSentAt: req.requestedAt,
				data: servResponse
			});
		} else {
			errorHandler.throwForbiddenActionError(
				`Forbidden activity. No changes were made.`
			);
		}
	} catch (err) {
		console.debug(`${logPrefix} ${err}`);
		errorHandler.mapError(err, req, res, next);
	}
};
