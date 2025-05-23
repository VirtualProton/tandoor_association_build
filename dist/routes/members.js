"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const addMember_1 = require("../controllers/Members/addMember");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const updateMember_1 = require("../controllers/Members/updateMember");
const getMember_1 = require("../controllers/Members/getMember");
const memberRoutes = (0, express_1.Router)();
memberRoutes.post('/validate_usc_number', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(addMember_1.validateUSCNumber));
memberRoutes.get('/get_members', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(getMember_1.getAllMember));
memberRoutes.post('/add_member', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(addMember_1.addMember));
memberRoutes.post('/update_member', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(updateMember_1.updateMember));
// memberRoutes.post('/approve_decline_member_changes',authenticateToken, errorHandler(approveOrDeclineMemberChanges));
// memberRoutes.get('/tests3', errorHandler(testS3));
exports.default = memberRoutes;
