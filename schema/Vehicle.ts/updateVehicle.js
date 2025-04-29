"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialVehicleUpdateSchema = exports.VehicleUpdateSchema = void 0;
const zod_1 = require("zod");
exports.VehicleUpdateSchema = zod_1.z.object({
    vehicleId: zod_1.z.string(),
    ownerName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    emailId: zod_1.z.string().email(),
    vehicleNumber: zod_1.z.string(),
});
exports.partialVehicleUpdateSchema = exports.VehicleUpdateSchema.partial().extend({
    vehicleId: zod_1.z.string()
});
