"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/Auth/auth.controller");
const error_handler_1 = require("../error-handler");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/request_otp', (0, error_handler_1.errorHandler)(auth_controller_1.requestOTP));
authRoutes.post('/verify_otp', (0, error_handler_1.errorHandler)(auth_controller_1.verifyOTP));
exports.default = authRoutes;
