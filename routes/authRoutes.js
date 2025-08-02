const express = require("express");
const authService = require("../services/authService");
const authRoutes = express.Router();

authRoutes
    .route("/signup")
    .post(authService.registerUser);
authRoutes
    .route("/login")
    .post(authService.loginUser);

module.exports = authRoutes;
