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
exports.addVehicle = void 0;
const addvehicle_1 = require("../../schema/Vehicle.ts/addvehicle");
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const addVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleDetails = addvehicle_1.VehicleRegistrationSchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const newVehicle = yield addVehicleHandler(prisma, vehicleDetails, req.user.userId);
            return newVehicle;
        }));
        res.status(200).json(result);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addVehicle = addVehicle;
const addVehicleHandler = (prisma, vehicleDetails, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.vehicles.create({
        data: {
            ownerName: vehicleDetails.ownerName,
            phoneNumber: vehicleDetails.phoneNumber,
            emailId: vehicleDetails.emailId,
            vehicleNumber: vehicleDetails.vehicleNumber,
            createdBy: userId
        },
    });
});
