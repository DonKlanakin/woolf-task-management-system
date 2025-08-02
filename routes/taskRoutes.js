const express = require("express");
const taskService = require("../services/taskService");
const securityManager = require("../security/securityManager");
const validator = require("../utils/validator");

const taskRoutes = express.Router();
taskRoutes
	.route("/")
	.get(
		securityManager.verifyToken,
		taskService.getAllTasks)
	.post(
		securityManager.verifyToken,
		taskService.createTask);
taskRoutes
	.route("/:id")
	.patch(
		securityManager.verifyToken,
		securityManager.verifyAdminLevelClearance,
		validator.validateId,
		taskService.updateTaskById
	);

module.exports = taskRoutes;
