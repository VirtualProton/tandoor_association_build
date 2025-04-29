"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTripSchema = void 0;
const zod_1 = require("zod");
exports.AddTripSchema = zod_1.z.object({
    vehicleId: zod_1.z.string(),
    route: zod_1.z.string(),
    amountPerTrip: zod_1.z.number(),
    numberOfTrips: zod_1.z.number(),
});
