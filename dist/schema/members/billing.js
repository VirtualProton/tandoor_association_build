"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberBillingHistorySchema = void 0;
const zod_1 = require("zod");
exports.MemberBillingHistorySchema = zod_1.z.object({
    membershipId: zod_1.z.string().max(225),
    fromDate: zod_1.z.coerce.date(),
    toDate: zod_1.z.coerce.date(),
    totalAmount: zod_1.z.coerce.number().nonnegative().max(99999999.99).default(0.00), // Decimal(10,2)
    paidAmount: zod_1.z.coerce.number().nonnegative().max(99999999.99).default(0.00), // Decimal(10,2)
    paymentStatus: zod_1.z.enum(["DUE", "PARTIAL", "PAID"]).default("DUE"),
    notes: zod_1.z.string().optional(),
    receiptPath: zod_1.z.string().max(225).optional(),
});
