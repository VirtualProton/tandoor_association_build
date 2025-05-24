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
exports.getVehicleByIdOrVehicleNumber = exports.getAllVehiclesDetails = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
// Expiry time constants
const SEVEN_DAYS_IN_SECONDS = 3 * 24 * 60 * 60;
const isVehicleId = (value) => {
    return /^VEH\d{4}-\d+$/.test(value); // Matches VEH2025-001, VEH2025-15, etc.
};
const getAllVehiclesDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (![
            "ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER",
        ].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const members = yield __1.prismaClient.vehicles.findMany({
            include: {
                tripRecords: true,
            },
        });
        res.json(members);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllVehiclesDetails = getAllVehiclesDetails;
const getVehicleByIdOrVehicleNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const input = req.params.id;
        if (![
            "ADMIN",
            "ADMIN_VIEWER",
            "TSMWA_EDITOR",
            "TSMWA_VIEWER",
            "TQMA_EDITOR",
            "TQMA_VIEWER",
        ].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!input) {
            return next(new bad_request_1.BadRequestsException("Vehicle identifier is required", root_1.ErrorCode.BAD_REQUEST));
        }
        const isId = isVehicleId(input);
        let vehicle = null;
        if (isId) {
            // Try direct ID cache
            const cachedVehicle = yield __1.redis.get(`vehicle:id:${input}`);
            if (cachedVehicle) {
                yield __1.redis.expire(`vehicle:id:${input}`, SEVEN_DAYS_IN_SECONDS);
                return res.json(JSON.parse(cachedVehicle));
            }
            // Not found in cache, check DB
            vehicle = yield __1.prismaClient.vehicles.findUnique({
                where: { vehicleId: input },
                include: {
                    tripRecords: true,
                },
            });
        }
        else {
            // Try reverse mapping: vehicle:number:<number> => id
            const vehicleId = yield __1.redis.get(`vehicle:number:${input}`);
            if (vehicleId) {
                const cachedVehicle = yield __1.redis.get(`vehicle:id:${vehicleId}`);
                if (cachedVehicle) {
                    yield __1.redis.expire(`vehicle:id:${vehicleId}`, SEVEN_DAYS_IN_SECONDS);
                    return res.json(JSON.parse(cachedVehicle));
                }
            }
            // Not found in cache, query DB by vehicle number
            vehicle = yield __1.prismaClient.vehicles.findFirst({
                where: { vehicleNumber: input },
                include: {
                    tripRecords: true,
                },
            });
        }
        if (!vehicle) {
            return next(new bad_request_1.BadRequestsException("Vehicle not found", root_1.ErrorCode.NOT_FOUND));
        }
        // Cache the result with ID and reverse mapping from vehicle number
        yield __1.redis.setex(`vehicle:id:${vehicle.id}`, SEVEN_DAYS_IN_SECONDS, JSON.stringify(vehicle));
        yield __1.redis.setex(`vehicle:number:${vehicle.vehicleNumber}`, SEVEN_DAYS_IN_SECONDS, vehicle.id);
        return res.json(vehicle);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getVehicleByIdOrVehicleNumber = getVehicleByIdOrVehicleNumber;
