"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabourPartialUpdateSchema = exports.LabourUpdateSchema = void 0;
const zod_1 = require("zod");
// For Update: id is optional
const laboursAdditionalDocs = zod_1.z.object({
    id: zod_1.z.number().optional(), // <-- Optional for partial update
    docName: zod_1.z.string(),
    docFilePath: zod_1.z.string()
});
// Full registration schema (for Create)
exports.LabourUpdateSchema = zod_1.z.object({
    labourId: zod_1.z.string(),
    fullName: zod_1.z.string(),
    fatherName: zod_1.z.string(),
    permanentAddress: zod_1.z.string(),
    presentAddress: zod_1.z.string(),
    aadharNumber: zod_1.z.string(),
    panNumber: zod_1.z.string(),
    esiNumber: zod_1.z.string(),
    employedIn: zod_1.z.string(),
    signaturePath: zod_1.z.string(),
    fingerPrint: zod_1.z.string(),
    aadharPhotoPath: zod_1.z.string(),
    livePhotoPath: zod_1.z.string(),
    laboursAdditionalDocs: zod_1.z.array(laboursAdditionalDocs).default([]) // <-- strict
});
// PATCH schema (for Update)
exports.LabourPartialUpdateSchema = exports.LabourUpdateSchema.partial()
    .extend({
    labourId: zod_1.z.string(), // labourId must still be required
    laboursAdditionalDocs: zod_1.z.array(laboursAdditionalDocs).optional() // <-- loose
})
    .refine((data) => Object.keys(data).length > 1, {
    message: "At least one field (besides labourId) must be provided for update."
});
