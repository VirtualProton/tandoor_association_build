"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabourRegistrationSchema = void 0;
const zod_1 = require("zod");
const Bool = zod_1.z.enum(["TRUE", "FALSE"]);
const laboursAdditionalDocs = zod_1.z.object({
    labourId: zod_1.z.string(),
    docName: zod_1.z.string(),
    docFilePath: zod_1.z.string()
});
exports.LabourRegistrationSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    fatherName: zod_1.z.string(),
    permanentAddress: zod_1.z.string(),
    presentAddress: zod_1.z.string(),
    aadharNumber: zod_1.z.string(),
    panNumber: zod_1.z.string(),
    esiNumber: zod_1.z.string(),
    employedIn: zod_1.z.string(),
    assignedTo: zod_1.z.string().optional(), // corresponds to `membershipId` from Members
    onBench: Bool.default("TRUE"),
    signaturePath: zod_1.z.string(),
    fingerPrint: zod_1.z.string(),
    aadharPhotoPath: zod_1.z.string(),
    livePhotoPath: zod_1.z.string(),
    laboursAdditionalDocs: zod_1.z.array(laboursAdditionalDocs).default([])
}).refine((data) => {
    // Either assignedTo or onBench must be true, but not both
    const isAssigned = !!data.assignedTo;
    const isOnBench = data.onBench === "TRUE";
    return (isAssigned || isOnBench) && !(isAssigned && isOnBench);
}, {
    message: "Labour must be either assigned to a member or marked as on bench, not both.",
    path: ["assignedTo"]
});
