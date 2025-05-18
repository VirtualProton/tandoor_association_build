"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabourPartialUpdateSchema = exports.LabourUpdateSchema = void 0;
const zod_1 = require("zod");
// Define the enum used in labourStatus
const labourStatusEnum = zod_1.z.enum(["ACTIVE", "INACTIVE", "ON_BENCH"]);
const labourAdditionalDoc = zod_1.z.object({
    id: zod_1.z.string().optional(),
    docName: zod_1.z.string().max(100),
    docPath: zod_1.z.string().max(225),
});
// Full registration schema (for Create)
exports.LabourUpdateSchema = zod_1.z.object({
    labourId: zod_1.z.string().max(225),
    fullName: zod_1.z.string().max(100),
    fatherName: zod_1.z.string().max(100),
    dob: zod_1.z
        .string()
        .max(50)
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    phoneNumber: zod_1.z.string().max(13),
    emailId: zod_1.z.string().max(50).email().optional().nullable(),
    aadharNumber: zod_1.z.string().length(12, "Aadhar must be 12 digits"),
    permanentAddress: zod_1.z.string().max(225),
    presentAddress: zod_1.z.string().max(225),
    photoPath: zod_1.z.string().max(225),
    aadharPath: zod_1.z.string().max(225),
    panNumber: zod_1.z.string().max(12),
    esiNumber: zod_1.z.string().max(50).optional().nullable(),
    labourStatus: labourStatusEnum.default("ON_BENCH"),
    assignedTo: zod_1.z.string().max(225).optional().nullable(),
    modifiedBy: zod_1.z.number().int().optional().nullable(),
    additionalDocs: zod_1.z.array(labourAdditionalDoc).default([]),
});
// PATCH schema (for Update)
exports.LabourPartialUpdateSchema = exports.LabourUpdateSchema.partial()
    .extend({
    labourId: zod_1.z.string(), // labourId must still be required
    laboursAdditionalDocs: zod_1.z.array(labourAdditionalDoc).optional() // <-- loose
})
    .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field (besides labourId) must be provided for update."
});
