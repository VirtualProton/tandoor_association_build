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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVehicle = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const updateVehicle_1 = require("../../schema/Vehicle.ts/updateVehicle");
const lodash_1 = __importDefault(require("lodash"));
const updateVehicle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateVehicleDetails = updateVehicle_1.partialVehicleUpdateSchema.parse(req.body);
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const existingVehicle = yield prisma.vehicles.findFirst({
                where: { vehicleId: updateVehicleDetails.vehicleId },
            });
            if (!existingVehicle) {
                return next(new bad_request_1.BadRequestsException("Vehicle not found", root_1.ErrorCode.NOT_FOUND));
            }
            const changes = calculateFieldDifferences(existingVehicle, updateVehicleDetails);
            if (Object.keys(changes).length === 0) {
                return next(new bad_request_1.BadRequestsException("NO_DATA_PROVIDED", root_1.ErrorCode.NO_DATA_PROVIDED));
            }
            const updatedVehicle = yield updateVehicleHandler(prisma, changes, existingVehicle.vehicleId, req.user.userId);
            return updatedVehicle;
        }));
        res.status(200).json(result);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.updateVehicle = updateVehicle;
const updateVehicleHandler = (prisma, vehicleDetails, vehicleId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.vehicles.update({
        where: { vehicleId: vehicleId },
        data: Object.assign(Object.assign({}, vehicleDetails), { modifiedBy: userId }),
    });
});
function calculateFieldDifferences(existing, incoming) {
    const result = {};
    for (const key in incoming) {
        if (lodash_1.default.isEqual(existing[key], incoming[key]))
            continue;
        result[key] = incoming[key];
    }
    return result;
}
