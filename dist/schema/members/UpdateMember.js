"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberPartialUpdateSchema = exports.MemberUpdateSchema = void 0;
const zod_1 = require("zod");
// Define enums
// const MembershipStatus = z.enum(["ACTIVE", "INACTIVE"]);
const GuardianRelation = zod_1.z.enum(["SO", "DO", "OTHER"]);
const Gender = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const OwnershipType = zod_1.z.enum(["OWNER", "TENANT"]);
const BusinessType = zod_1.z.enum(["OWN_BUSINESS", "PARTNERSHIP", "OTHER"]);
const AttachmentType = zod_1.z.enum(["SALE_DEED", "RENT_AGREEMENT", "OTHER"]);
const ProposerType = zod_1.z.enum(["FACTORY_OWNER", "EXECUTIVE_MEMBER"]);
const Bool = zod_1.z.enum(["TRUE", "FALSE"]);
// Define the Branch Schema
const Proposer = zod_1.z.object({
    proposerId: zod_1.z.string().nullable(),
    proposerType: ProposerType.nullable(),
    signaturePath: zod_1.z.string().nullable(),
});
const MachineryInformations = zod_1.z.object({
    highPolishMachine: zod_1.z.number().int().default(0),
    sliceMachine: zod_1.z.number().int().default(0),
    cuttingMachine: zod_1.z.number().int().default(0),
    other: zod_1.z.number().int().default(0),
});
const BranchSchema = zod_1.z.object({
    id: zod_1.z.number(),
    electricalUscNumber: zod_1.z.string(),
    surveyNumber: zod_1.z.number(),
    village: zod_1.z.string().max(50),
    zone: zod_1.z.string().max(50),
    ownershipType: OwnershipType.default("OWNER"),
    businessType: BusinessType.default("OWN_BUSINESS"),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }),
    machineryInformations: MachineryInformations,
});
const ComplianceDetails = zod_1.z.object({
    gstinNumber: zod_1.z.string().max(50),
    factoryLicenseNumber: zod_1.z.string().max(50),
    tspcbOrderNumber: zod_1.z.string().max(50),
    mdlNumber: zod_1.z.string().max(50),
    udyamCertificateNumber: zod_1.z.string().max(50),
    fullAddress: zod_1.z.string().max(225),
    partnerName: zod_1.z.string().max(50),
    contactNumber: zod_1.z.string().max(13),
    AadharNumber: zod_1.z.string().max(15),
});
const SimilarMembershipInquiry = zod_1.z.object({
    isSimilarMember: Bool.default("FALSE"),
    previousMembershipDetails: zod_1.z.string().max(225).optional(),
});
const Attachments = zod_1.z.object({
    attachmentType: AttachmentType.default("SALE_DEED"),
    filePath: zod_1.z.string().max(225),
});
const Declarations = zod_1.z.object({
    agreesToTerms: Bool.default("FALSE"),
    partnerPhotoPath: zod_1.z.string().max(225),
    applicationSignaturePath: zod_1.z.string().max(225),
});
// Define the MemberSignUpSchema
exports.MemberUpdateSchema = zod_1.z.object({
    membershipId: zod_1.z.string(),
    electricalUscNumber: zod_1.z.string(),
    applicantName: zod_1.z.string().max(50),
    guardianRelation: GuardianRelation.default("SO"),
    guardianName: zod_1.z.string().max(50),
    gender: Gender.default("MALE"),
    firmName: zod_1.z.string().max(50),
    proprietorName: zod_1.z.string().max(50),
    officeNumber: zod_1.z.string().max(15),
    phoneNumber1: zod_1.z.string().max(15),
    phoneNumber2: zod_1.z.string().max(15).optional(),
    surveyNumber: zod_1.z.number(),
    village: zod_1.z.string().max(50),
    zone: zod_1.z.string().max(50),
    ownershipType: OwnershipType.default("OWNER"),
    businessType: BusinessType.default("OWN_BUSINESS"),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }),
    estimatedMaleWorker: zod_1.z.number().int().default(0),
    estimatedFemaleWorker: zod_1.z.number().int().default(0),
    machineryInformations: MachineryInformations,
    branches: zod_1.z.array(BranchSchema).default([]),
    complianceDetails: ComplianceDetails,
    similarMembershipInquiry: SimilarMembershipInquiry,
    attachments: Attachments,
    proposer: Proposer,
    executiveProposer: Proposer,
    declarations: Declarations,
});
const PartialBranchSchema = BranchSchema.partial().extend({
    id: BranchSchema.shape.id,
});
exports.MemberPartialUpdateSchema = exports.MemberUpdateSchema.partial().extend({
    membershipId: exports.MemberUpdateSchema.shape.membershipId,
    branches: zod_1.z.array(PartialBranchSchema).optional(),
}).refine((data) => Object.keys(data).length > 1, { message: "At least one field (other than membershipId) must be provided for update." });
