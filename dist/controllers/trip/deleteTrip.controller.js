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
exports.deleteTripsByVehicleId = exports.deleteTrip = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const deleteTrip = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tripId } = req.params;
        if (!tripId) {
            return res.status(400).json({ message: "tripId is required" });
        }
        const deletedTrip = yield __1.prismaClient.tripRecords.delete({
            where: { tripId },
        });
        return res.status(200).json({ message: "Trip deleted successfully", trip: deletedTrip });
    }
    catch (error) {
        console.error("Error deleting trip:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.deleteTrip = deleteTrip;
const deleteTripsByVehicleId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return res.status(400).json({ message: "vehicleId is required" });
        }
        const deletedTrips = yield __1.prismaClient.tripRecords.deleteMany({
            where: { vehicleId },
        });
        return res.status(200).json({ message: "Trips deleted successfully", count: deletedTrips.count });
    }
    catch (error) {
        console.error("Error deleting trip:", error);
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.deleteTripsByVehicleId = deleteTripsByVehicleId;
