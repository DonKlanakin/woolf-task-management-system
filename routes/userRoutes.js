const express = require("express");
const userService = require("../services/userService");
const securityManager = require("../security/securityManager");
const validator = require("../utils/validator");
const userRoutes = express.Router();

userRoutes
	.route("/")
	.get(
		securityManager.verifyToken,
		securityManager.verifyOperatorLevelClearance,
		userService.getAllUsers
	);
userRoutes
	.route("/:id")
	.post(
		securityManager.verifyToken,
        securityManager.verifyAdminLevelClearance,
		validator.validateId,
		userService.updateUserById
	);

module.exports = userRoutes;
