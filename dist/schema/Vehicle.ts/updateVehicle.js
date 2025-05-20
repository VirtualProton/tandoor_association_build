"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialVehicleUpdateSchema = exports.VehicleUpdateSchema = void 0;
const zod_1 = require("zod");
exports.VehicleUpdateSchema = zod_1.z.object({
    vehicleNumber: zod_1.z.string().max(20),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
    driverName: zod_1.z.string().max(50),
    driverPhoneNumber: zod_1.z.string().max(13),
    ownerName: zod_1.z.string().max(50),
    ownerPhoneNumber: zod_1.z.string().max(13),
});
exports.partialVehicleUpdateSchema = exports.VehicleUpdateSchema.partial().extend({
    vehicleId: zod_1.z.string(),
});
