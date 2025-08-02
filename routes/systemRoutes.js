const express = require("express");
const systemService = require("../services/systemService");
const errorHandler = require("../utils/errorHandler");

const systemRoutes = express.Router();
systemRoutes.route("/env").get(systemService.getEnv);
systemRoutes.all(/./, errorHandler.handlePathNotFound);

module.exports = systemRoutes;
