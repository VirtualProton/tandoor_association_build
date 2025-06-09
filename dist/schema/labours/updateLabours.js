"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabourPartialUpdateSchema = exports.LabourUpdateSchema = void 0;
const zod_1 = require("zod");
// Define the enum used in labourStatus
const labourStatusEnum = zod_1.z.enum(["ACTIVE", "INACTIVE", "ON_BENCH"]);
const labourAdditionalDoc = zod_1.z.object({
    id: zod_1.z.number().int().optional(),
    docName: zod_1.z.string().max(100),
    docFilePath: zod_1.z.string().max(225),
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
    eShramId: zod_1.z.string().max(50).optional().nullable(),
    labourStatus: labourStatusEnum,
    assignedTo: zod_1.z.string().max(225).optional().nullable(),
    reasonForTransfer: zod_1.z.string().max(225).optional().nullable(),
    newAdditionalDocs: zod_1.z.array(labourAdditionalDoc).default([]),
    updateAdditionalDocs: zod_1.z.array(labourAdditionalDoc).default([]),
    deleteAdditionalDocs: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.number().int()
    }))
});
// PATCH schema (for Update)
exports.LabourPartialUpdateSchema = exports.LabourUpdateSchema.partial()
    .extend({
    labourId: zod_1.z.string(), // labourId must still be required
})
    .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field (besides labourId) must be provided for update."
}).transform((data) => {
    if (data.assignedTo && !data.labourStatus) {
        data.labourStatus = "ACTIVE";
    }
    else if (!data.assignedTo && (data.labourStatus === "INACTIVE" || data.labourStatus === "ON_BENCH")) {
        data.assignedTo = null;
    }
    return data;
}).superRefine((data, ctx) => {
    if ((data.labourStatus === "INACTIVE" || data.labourStatus === "ON_BENCH") && data.assignedTo) {
        ctx.addIssue({
            path: ["assignedTo"],
            code: zod_1.z.ZodIssueCode.custom,
            message: `'assignedTo' must be null when labourStatus is '${data.labourStatus}'`,
        });
    }
    else if (data.labourStatus === "ACTIVE" && !data.assignedTo) {
        ctx.addIssue({
            path: ["assignedTo"],
            code: zod_1.z.ZodIssueCode.custom,
            message: `'assignedTo' cannot be null when labourStatus is '${data.labourStatus}'`,
        });
    }
});
