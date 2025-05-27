"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaseQueryByStatus = exports.getLeaseQueryByMembershipId = exports.getAllLeaseQuery = exports.getLeaseQueryById = void 0;
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const getLeaseQueryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { leaseQueryId } = req.params;
    try {
        const leaseQuery = yield __1.prismaClient.leaseQuery.findUnique({
            where: { leaseQueryId }
        });
        if (!leaseQuery) {
            return res.status(404).json({
                message: "Lease query not found"
            });
        }
        res.status(200).json({
            message: "Lease query retrieved successfully",
            data: leaseQuery
        });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(`Failed to retrieve lease queries ${error.message}`, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getLeaseQueryById = getLeaseQueryById;
const getAllLeaseQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaseQueries = yield __1.prismaClient.leaseQuery.findMany();
        res.status(200).json({
            message: "Lease queries retrieved successfully",
            data: leaseQueries
        });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(`Failed to retrieve lease queries ${error.message}`, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllLeaseQuery = getAllLeaseQuery;
const getLeaseQueryByMembershipId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { membershipId } = req.params;
    try {
        const leaseQueries = yield __1.prismaClient.leaseQuery.findMany({
            where: { membershipId }
        });
        if (leaseQueries.length === 0) {
            return res.status(404).json({
                message: "No lease queries found for this membership"
            });
        }
        res.status(200).json({
            message: "Lease queries retrieved successfully",
            data: leaseQueries
        });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(`Failed to retrieve lease queries ${error.message}`, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getLeaseQueryByMembershipId = getLeaseQueryByMembershipId;
const getLeaseQueryByStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    const upperStatus = status.toUpperCase();
    if (!["PENDING", "PROCESSING", "RESOLVED", "REJECTED"].includes(upperStatus)) {
        return res.status(400).json({
            message: "Invalid status provided"
        });
    }
    try {
        const leaseQueries = yield __1.prismaClient.leaseQuery.findMany({
            where: { status: upperStatus }
        });
        if (leaseQueries.length === 0) {
            return res.status(404).json({
                message: "No lease queries found for this status"
            });
        }
        res.status(200).json({
            message: "Lease queries retrieved successfully",
            data: leaseQueries
        });
    }
    catch (error) {
        next(new bad_request_1.BadRequestsException(`Failed to retrieve lease queries ${error.message}`, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getLeaseQueryByStatus = getLeaseQueryByStatus;
