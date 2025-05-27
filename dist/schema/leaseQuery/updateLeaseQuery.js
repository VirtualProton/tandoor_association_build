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
exports.updateLeaseQuerySchema = void 0;
const zod_1 = require("zod");
// Base schemas
const LeaseQueryAttachmentsSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    documentName: zod_1.z.string().max(50).optional(),
    documentPath: zod_1.z.string().max(225).optional(),
});
const deleteAttachmentSchema = zod_1.z.object({
    id: zod_1.z.number(),
});
// Main schema
exports.updateLeaseQuerySchema = zod_1.z
    .object({
    leaseQueryId: zod_1.z.string().max(225), // Required
    membershipId: zod_1.z.string().max(225).optional(),
    presentLeaseHolder: zod_1.z.string().max(225).optional(),
    dateOfLease: zod_1.z.coerce.date().optional(),
    expiryOfLease: zod_1.z.coerce.date().optional(),
    dateOfRenewal: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(["PENDING", "PROCESSING", "RESOLVED", "REJECTED"]).optional(),
    newAttachments: zod_1.z.array(LeaseQueryAttachmentsSchema).optional(),
    updateAttachments: zod_1.z.array(LeaseQueryAttachmentsSchema).optional(),
    deleteAttachment: zod_1.z.array(deleteAttachmentSchema).optional(),
})
    .superRefine((data, ctx) => {
    // Ensure at least one field other than leaseQueryId is provided
    const { leaseQueryId } = data, rest = __rest(data, ["leaseQueryId"]);
    if (Object.keys(rest).length === 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "At least one field besides 'leaseQueryId' must be provided",
            path: [],
        });
    }
    // If newAttachments are present, validate required fields
    if (data.newAttachments) {
        data.newAttachments.forEach((att, index) => {
            if (!att.documentName) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "documentName is required in newAttachments",
                    path: ["newAttachments", index, "documentName"],
                });
            }
            if (!att.documentPath) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "documentPath is required in newAttachments",
                    path: ["newAttachments", index, "documentPath"],
                });
            }
        });
    }
    // If updateAttachments are present, each must have an id
    if (data.updateAttachments) {
        data.updateAttachments.forEach((att, index) => {
            if (att.id === undefined) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "id is required in updateAttachments",
                    path: ["updateAttachments", index, "id"],
                });
            }
        });
    }
    // If deleteAttachment is present, each must have an id (already enforced by schema, but added for completeness)
    if (data.deleteAttachment) {
        data.deleteAttachment.forEach((att, index) => {
            if (att.id === undefined) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    message: "id is required in deleteAttachment",
                    path: ["deleteAttachment", index, "id"],
                });
            }
        });
    }
});
