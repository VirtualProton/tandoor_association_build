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
exports.deleteVehicle = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const deleteVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleId = req.params.vehicleId;
        if (!req.user || req.user.role !== "ADMIN") {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!vehicleId) {
            return res.status(400).json({ message: "Vehicle ID is required" });
        }
        const deletedVehicle = yield __1.prismaClient.vehicles.delete({
            where: { vehicleId },
        });
        return res
            .status(200)
            .json({ message: "Vehicle deleted", vehicle: deletedVehicle });
    }
    catch (error) {
        if (error.code === "P2025") {
            // Prisma error code for "Record to delete does not exist."
            return res.status(404).json({ message: "Vehicle not found" });
        }
        return next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.deleteVehicle = deleteVehicle;
