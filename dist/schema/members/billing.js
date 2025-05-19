"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberBillingHistorySchema = void 0;
const zod_1 = require("zod");
exports.MemberBillingHistorySchema = zod_1.z.object({
    membershipId: zod_1.z.string().max(225),
    fromDate: zod_1.z.coerce.date(),
    toDate: zod_1.z.coerce.date(),
    totalAmount: zod_1.z.coerce.number().nonnegative().max(99999999.99).default(0.0),
    paidAmount: zod_1.z.coerce.number().nonnegative().max(99999999.99).default(0.0),
    notes: zod_1.z.string().optional(),
    receiptPath: zod_1.z.string().max(225).optional(),
}).transform((data) => {
    const dueAmount = data.totalAmount - data.paidAmount;
    const paymentStatus = data.paidAmount === 0
        ? "DUE"
        : data.paidAmount < data.totalAmount
            ? "PARTIAL"
            : "PAID";
    return Object.assign(Object.assign({}, data), { dueAmount,
        paymentStatus });
});
