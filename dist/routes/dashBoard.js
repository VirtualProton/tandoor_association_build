"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getOverView_controller_1 = require("../controllers/Dashboard/getOverView.controller");
const error_handler_1 = require("../error-handler");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const dashboardRoutes = (0, express_1.Router)();
dashboardRoutes.get('/get_over_view', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(getOverView_controller_1.getOverView));
exports.default = dashboardRoutes;
