"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const healthCheck_controller_1 = require("../controllers/Health/healthCheck.controller");
const healthRoutes = (0, express_1.Router)();
healthRoutes.get('/check', (0, error_handler_1.errorHandler)(healthCheck_controller_1.healthCheck));
exports.default = healthRoutes;
