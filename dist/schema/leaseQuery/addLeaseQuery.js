"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLeaseQuerySchema = void 0;
const zod_1 = require("zod");
const LeaseQueryAttachmentsSchema = zod_1.z.object({
    documentName: zod_1.z.string().max(50),
    documentPath: zod_1.z.string().max(225),
});
exports.addLeaseQuerySchema = zod_1.z.object({
    leaseQueryId: zod_1.z.string().max(225).optional(),
    membershipId: zod_1.z.string().max(225),
    presentLeaseHolder: zod_1.z.string().max(225),
    dateOfLease: zod_1.z.coerce.date(),
    expiryOfLease: zod_1.z.coerce.date(),
    dateOfRenewal: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(["PENDING", "PROCESSING", "RESOLVED", "REJECTED"]).default("PENDING"),
    leaseQueryAttachments: zod_1.z.array(LeaseQueryAttachmentsSchema).optional()
});
