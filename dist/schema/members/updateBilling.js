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
exports.billingPartialUpdateSchema = void 0;
const zod_1 = require("zod");
exports.billingPartialUpdateSchema = zod_1.z.object({
    billingId: zod_1.z.string().max(225), // required
    membershipId: zod_1.z.string().max(225).optional(),
    fromDate: zod_1.z.coerce.date().optional(),
    toDate: zod_1.z.coerce.date().optional(),
    paymentDate: zod_1.z.coerce.date().optional(),
    totalAmount: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    paidAmount: zod_1.z.coerce.number().nonnegative().max(99999999.99).optional(),
    notes: zod_1.z.string().optional(),
    receiptPath: zod_1.z.string().max(225).optional(),
}).refine((data) => {
    // Extract all keys except billingId and check if at least one is present
    const { billingId } = data, rest = __rest(data, ["billingId"]);
    return Object.values(rest).some((v) => v !== undefined);
}, {
    message: "At least one field other than billingId must be provided",
    path: [], // applies to the whole object
});
