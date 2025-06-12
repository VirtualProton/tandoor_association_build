"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const error_handler_1 = require("../error-handler");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const addLeaseQuery_controller_1 = require("../controllers/LeaseQuery/addLeaseQuery.controller"); // Import the controller
const deleteLeaseQuery_controller_1 = require("../controllers/LeaseQuery/deleteLeaseQuery.controller");
const getLeaseQuery_controller_1 = require("../controllers/LeaseQuery/getLeaseQuery.controller");
const updateLeaseQuery_controller_1 = require("../controllers/LeaseQuery/updateLeaseQuery.controller");
const renewalLease_controller_1 = require("../controllers/LeaseQuery/renewalLease.controller");
const leaseQueryRoutes = (0, express_1.Router)();
leaseQueryRoutes.post('/add_lease_query', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(addLeaseQuery_controller_1.addLeaseQueryController));
// This route handles adding a new lease query, ensuring the user is authenticated and the request is processed through the error handler.  
leaseQueryRoutes.post('/update_lease_query', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(updateLeaseQuery_controller_1.updateLeaseQueryController)); // Assuming the same controller handles updates
leaseQueryRoutes.post('/renew_lease_query', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(renewalLease_controller_1.renewalLeaseController));
leaseQueryRoutes.delete('/delete_lease_query/:leaseQueryId', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(deleteLeaseQuery_controller_1.deleteLeaseQuery));
leaseQueryRoutes.get('/get_lease_query/:leaseQueryId', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(getLeaseQuery_controller_1.getLeaseQueryById));
leaseQueryRoutes.get('/get_all_lease_queries', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(getLeaseQuery_controller_1.getAllLeaseQuery));
leaseQueryRoutes.get('/get_lease_queries_by_membership/:membershipId', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(getLeaseQuery_controller_1.getLeaseQueryByMembershipId));
leaseQueryRoutes.get('/get_lease_queries_by_status/:status', authenticateToken_1.authenticateToken, (0, error_handler_1.errorHandler)(getLeaseQuery_controller_1.getLeaseQueryByStatus));
exports.default = leaseQueryRoutes;
// This file defines the routes for lease queries, including adding, deleting, and retrieving lease queries.
