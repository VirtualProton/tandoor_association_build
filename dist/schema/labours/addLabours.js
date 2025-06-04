"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabourSchema = void 0;
const zod_1 = require("zod");
// Define the enum used in labourStatus
const labourStatusEnum = zod_1.z.enum(["ACTIVE", "INACTIVE"]);
const labourAdditionalDoc = zod_1.z.object({
    docName: zod_1.z.string().max(100),
    docFilePath: zod_1.z.string().max(225),
});
exports.LabourSchema = zod_1.z
    .object({
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
    labourStatus: labourStatusEnum.default("ACTIVE"),
    assignedTo: zod_1.z.string().max(225).optional().nullable(),
    additionalDocs: zod_1.z.array(labourAdditionalDoc).default([]),
});
