"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLeaseQuerySchema = void 0;
const zod_1 = require("zod");
const LeaseQueryAttachmentsSchema = zod_1.z.object({
    documentName: zod_1.z.string().max(50),
    documentPath: zod_1.z.string().max(225),
});
const LeaseQueryHistorySchema = zod_1.z.object({
    membershipId: zod_1.z.string().max(225),
    leaseHolderName: zod_1.z.string().max(225).optional().nullable(),
    fromDate: zod_1.z.coerce.date(),
    toDate: zod_1.z.coerce.date(),
});
exports.addLeaseQuerySchema = zod_1.z.object({
    leaseQueryId: zod_1.z.string().max(225).optional(),
    membershipId: zod_1.z.string().max(225),
    presentLeaseHolder: zod_1.z.string().max(225),
    dateOfLease: zod_1.z.coerce.date(),
    expiryOfLease: zod_1.z.coerce.date(),
    status: zod_1.z.enum(["PENDING", "PROCESSING", "RESOLVED", "REJECTED"]).default("PENDING"),
    leaseQueryAttachments: zod_1.z.array(LeaseQueryAttachmentsSchema).default([]),
    LeaseQueryHistory: zod_1.z.array(LeaseQueryHistorySchema).default([]),
}).transform((data) => {
    const renewalDate = new Date(data.expiryOfLease);
    renewalDate.setDate(renewalDate.getDate() + 1); // Adds 1 day
    return Object.assign(Object.assign({}, data), { dateOfRenewal: renewalDate });
});
