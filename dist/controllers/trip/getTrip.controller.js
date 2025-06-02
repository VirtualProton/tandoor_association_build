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
exports.getTripsByVehicleId = exports.getTripById = exports.getAllTrips = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getAllTrips = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trips = yield __1.prismaClient.tripRecords.findMany();
        res.status(200).json({ trips });
    }
    catch (e) {
        console.error("Error adding trip:", e);
        // Handle specific error cases if needed
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllTrips = getAllTrips;
const getTripById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return next(new bad_request_1.BadRequestsException("tripId is required", root_1.ErrorCode.BAD_REQUEST));
        }
        const trip = yield __1.prismaClient.tripRecords.findUnique({
            where: { tripId },
        });
        if (!trip) {
            return next(new bad_request_1.BadRequestsException("Trip not found", root_1.ErrorCode.NOT_FOUND));
        }
        res.status(200).json({ trip });
    }
    catch (e) {
        console.error("Error fetching trip:", e);
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getTripById = getTripById;
const getTripsByVehicleId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return next(new bad_request_1.BadRequestsException("vehicleId is required", root_1.ErrorCode.BAD_REQUEST));
        }
        const trips = yield __1.prismaClient.tripRecords.findMany({
            where: { vehicleId },
        });
        res.status(200).json({ trips });
    }
    catch (e) {
        console.error("Error fetching trips by vehicleId:", e);
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getTripsByVehicleId = getTripsByVehicleId;
