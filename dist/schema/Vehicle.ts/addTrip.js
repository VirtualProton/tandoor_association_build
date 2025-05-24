"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTripSchema = void 0;
const zod_1 = require("zod");
exports.AddTripSchema = zod_1.z.object({
    vehicleId: zod_1.z.string(),
    tripDate: zod_1.z.coerce.date(),
    amountPerTrip: zod_1.z.coerce.number().nonnegative().max(99999999.99).default(0.0),
    numberOfTrips: zod_1.z.coerce.number().min(1).default(1),
    notes: zod_1.z.string().optional(),
    receiptPath: zod_1.z.string().max(225).optional(),
    amountPaid: zod_1.z.coerce.number().nonnegative().max(99999999.99).default(0.0),
}).transform((data) => {
    const totalAmount = data.amountPerTrip * data.numberOfTrips;
    const paymentStatus = data.amountPaid === 0
        ? "UNPAID"
        : data.amountPaid < totalAmount
            ? "PARTIAL"
            : "PAID";
    const balanceAmount = totalAmount - data.amountPaid;
    return Object.assign(Object.assign({}, data), { totalAmount,
        paymentStatus,
        balanceAmount });
});
