"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberPartialUpdateSchema = exports.MemberUpdateSchema = void 0;
const zod_1 = require("zod");
// Enums (updated)
const GuardianRelation = zod_1.z.enum(["SO", "DO", "WO"]);
const Gender = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const OwnershipType = zod_1.z.enum(["OWNER", "TENANT", "TRADER"]);
const BusinessType = zod_1.z.enum(["OWNED", "RENTED", "TRADING", "OTHER"]);
const AttachmentType = zod_1.z.enum(["SALE_DEED", "RENT_AGREEMENT", "OTHER"]);
const Bool = zod_1.z.enum(["TRUE", "FALSE"]);
// Proposer Schema
const Proposer = zod_1.z.object({
    proposerId: zod_1.z.string().nullable().optional(),
    signaturePath: zod_1.z.string().nullable().optional(),
});
// Machinery Info Schema
const MachineryInformations = zod_1.z.object({
    id: zod_1.z.number().optional(),
    machineName: zod_1.z.string().max(50),
    machineCount: zod_1.z.number().int().default(0)
});
// Partner Details Schema
const PartnerDetails = zod_1.z.object({
    id: zod_1.z.number().optional(),
    partnerName: zod_1.z.string().max(50),
    partnerAadharNo: zod_1.z.string().max(15),
    partnerPanNo: zod_1.z.string().max(12),
    contactNumber: zod_1.z.string().max(10),
    emailId: zod_1.z.string().max(50),
});
// Branch Schema
const BranchSchema = zod_1.z.object({
    id: zod_1.z.number().optional(),
    electricalUscNumber: zod_1.z.string(),
    scNumber: zod_1.z.string(),
    proprietorType: zod_1.z.string(),
    proprietorStatus: zod_1.z.string(),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }),
    placeOfBusiness: zod_1.z.string().max(50),
    machineryInformations: zod_1.z.array(MachineryInformations).default([]),
});
// Compliance Details Schema
const ComplianceDetails = zod_1.z.object({
    gstInNumber: zod_1.z.string().max(50),
    gstInCertificatePath: zod_1.z.string().max(225),
    factoryLicenseNumber: zod_1.z.string().max(50),
    factoryLicensePath: zod_1.z.string().max(225),
    tspcbOrderNumber: zod_1.z.string().max(50),
    tspcbCertificatePath: zod_1.z.string().max(225),
    mdlNumber: zod_1.z.string().max(50),
    mdlCertificatePath: zod_1.z.string().max(225),
    udyamCertificateNumber: zod_1.z.string().max(50),
    udyamCertificatePath: zod_1.z.string().max(225),
    fullAddress: zod_1.z.string().max(225),
    partnerName: zod_1.z.string().max(50),
    contactNumber: zod_1.z.string().max(13),
    AadharNumber: zod_1.z.string().max(15),
    emailId: zod_1.z.string().max(50),
    panNumber: zod_1.z.string().max(12),
});
// Similar Membership Inquiry
const SimilarMembershipInquiry = zod_1.z.object({
    is_member_of_similar_org: Bool.default("FALSE"),
    has_applied_earlier: Bool.default("FALSE"),
    is_valid_member: Bool.default("FALSE"),
    is_executive_member: Bool.default("FALSE"),
});
// Attachments Schema
const Attachments = zod_1.z.object({
    id: zod_1.z.number().optional(),
    documentName: zod_1.z.string().max(50),
    documentPath: zod_1.z.string().max(225),
});
// Declarations
const Declarations = zod_1.z.object({
    agreesToTerms: Bool.default("FALSE"),
    membershipFormPath: zod_1.z.string().max(225),
    applicationSignaturePath: zod_1.z.string().max(225),
});
// Member Update Schema
exports.MemberUpdateSchema = zod_1.z.object({
    membershipId: zod_1.z.string(),
    scNumber: zod_1.z.string(),
    electricalUscNumber: zod_1.z.string(),
    applicantName: zod_1.z.string().max(50),
    relation: GuardianRelation.default("SO"),
    relativeName: zod_1.z.string().max(50),
    gender: Gender.default("MALE"),
    firmName: zod_1.z.string().max(50),
    partnerName: zod_1.z.string().max(50),
    officeNumber: zod_1.z.string().max(15),
    phoneNumber1: zod_1.z.string().max(15),
    phoneNumber2: zod_1.z.string().max(15).optional(),
    surveyNumber: zod_1.z.number(),
    village: zod_1.z.string().max(50),
    zone: zod_1.z.string().max(50),
    ownershipType: OwnershipType.default("OWNER"),
    businessType: BusinessType.default("OWNED"),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }),
    partnerDetails: zod_1.z.array(PartnerDetails).default([]),
    estimatedMaleWorker: zod_1.z.number().int().default(0),
    estimatedFemaleWorker: zod_1.z.number().int().default(0),
    machineryInformations: zod_1.z.array(MachineryInformations).default([]),
    branches: zod_1.z.array(BranchSchema).default([]),
    complianceDetails: ComplianceDetails,
    similarMembershipInquiry: SimilarMembershipInquiry,
    attachments: zod_1.z.array(Attachments).default([]),
    proposer: Proposer,
    executiveProposer: Proposer,
    declarations: Declarations,
});
// Partial Update Schema
const PartialBranchSchema = BranchSchema.partial().extend({
    id: BranchSchema.shape.id,
});
exports.MemberPartialUpdateSchema = exports.MemberUpdateSchema.partial().extend({
    membershipId: exports.MemberUpdateSchema.shape.membershipId,
    branches: zod_1.z.array(PartialBranchSchema).optional(),
}).refine((data) => Object.keys(data).length > 1, { message: "At least one field (other than membershipId) must be provided for update." });
