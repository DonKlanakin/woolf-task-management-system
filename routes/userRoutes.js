const express = require("express");
const userService = require("../services/userService");
const securityManager = require("../security/securityManager");
const validator = require("../utils/validator");
const userRoutes = express.Router();

userRoutes
	.route("/")
	.get(
		securityManager.verifyToken,
		securityManager.verifyAdminLevelClearance,
		userService.getAllUsers
	);
userRoutes
	.route("/:id")
	.get(
		securityManager.verifyToken,
		userService.getUserById
	);

module.exports = userRoutes;
