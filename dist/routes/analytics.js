"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const dataAnalysis_controller_1 = require("../controllers/Analytics/dataAnalysis.controller");
const analyticsRoutes = (0, express_1.Router)();
analyticsRoutes.get('/get_analysis', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(dataAnalysis_controller_1.getDataAnalysis));
exports.default = analyticsRoutes;
