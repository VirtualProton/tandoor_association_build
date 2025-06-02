"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTripSchema = void 0;
const zod_1 = require("zod");
exports.updateTripSchema = zod_1.z.object({
    tripId: zod_1.z.string(),
    vehicleId: zod_1.z.string().optional(),
    tripDate: zod_1.z.coerce.date().optional(),
    amountPerTrip: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    numberOfTrips: zod_1.z.coerce.number().min(1).optional(),
    notes: zod_1.z.string().optional(),
    receiptPath: zod_1.z.string().max(225).optional(),
    amountPaid: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional()
}).refine(data => {
    // Exclude `tripId` from the check
    const { tripId } = data, rest = __rest(data, ["tripId"]);
    return Object.values(rest).some(value => value !== undefined);
}, {
    message: "At least one field other than 'tripId' must be provided.",
    //   path: [] // applies to the whole object
});
