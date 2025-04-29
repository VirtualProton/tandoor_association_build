"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.VehicleRegistrationSchema = zod_1.z.object({
    ownerName: zod_1.z.string(),
    phoneNumber: zod_1.z.string(),
    emailId: zod_1.z.string().email(),
    vehicleNumber: zod_1.z.string(),
});
