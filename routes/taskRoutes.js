const express = require("express");
const taskService = require("../services/taskService");
const securityManager = require("../security/securityManager");
const validator = require("../utils/validator");
const taskRoutes = express.Router();

taskRoutes
    .route("/")
    .get(
        securityManager.verifyToken,
        taskService.getAllTasks
    )
    .post(
        securityManager.verifyToken,
        taskService.createTask
    );
taskRoutes
    .route("/:id")
    .get(
        securityManager.verifyToken,
        validator.validateId,
        taskService.getTaskById
    )
    .put(
        securityManager.verifyToken,
        validator.validateId,
        taskService.updateTaskById
    )
    .delete(
        securityManager.verifyToken,
        validator.validateId,
        taskService.deleteTaskById
    );

module.exports = taskRoutes;