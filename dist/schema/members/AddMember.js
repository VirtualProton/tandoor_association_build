"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberSignUpSchema = void 0;
const zod_1 = require("zod");
// Define enums
// Updated Enums based on schema
const GuardianRelation = zod_1.z.enum(["SO", "DO", "WO"]);
const Gender = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const OwnershipType = zod_1.z.enum(["OWNER", "TENANT", "TRADER"]);
const BusinessType = zod_1.z.enum(["OWNED", "RENTED", "TRADER", "FACTORY_GIVEN_ON_LEASE"]);
const Bool = zod_1.z.enum(["TRUE", "FALSE"]);
// Define the Branch Schema
const Proposer = zod_1.z.object({
    proposerID: zod_1.z.string().nullable(),
    signaturePath: zod_1.z.string().nullable(),
});
const MachineryInformations = zod_1.z.object({
    machineName: zod_1.z.string().max(50),
    machineCount: zod_1.z.number().int().default(0)
});
const PartnerDetails = zod_1.z.object({
    partnerName: zod_1.z.string().max(50),
    partnerAadharNo: zod_1.z.string().max(15),
    partnerPanNo: zod_1.z.string().max(12),
    contactNumber: zod_1.z.string().max(10),
    emailId: zod_1.z.string().max(50),
});
const BranchSchema = zod_1.z.object({
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
// Similar Membership Inquiry Schema
const SimilarMembershipInquiry = zod_1.z.object({
    is_member_of_similar_org: Bool.default("FALSE"),
    has_applied_earlier: Bool.default("FALSE"),
    is_valid_member: Bool.default("FALSE"),
    is_executive_member: Bool.default("FALSE"),
});
const Attachments = zod_1.z.object({
    documentName: zod_1.z.string().max(50),
    documentPath: zod_1.z.string().max(225),
});
const Declarations = zod_1.z.object({
    agreesToTerms: Bool.default("FALSE"),
    membershipFormPath: zod_1.z.string().max(225),
    applicationSignaturePath: zod_1.z.string().max(225),
});
// Main Member Sign-Up Schema
exports.MemberSignUpSchema = zod_1.z.object({
    electricalUscNumber: zod_1.z.string(),
    doj: zod_1.z.coerce.date().default(new Date()),
    scNumber: zod_1.z.string(),
    applicantName: zod_1.z.string().max(50),
    relation: GuardianRelation.default("SO"),
    relativeName: zod_1.z.string().max(50),
    gender: Gender.default("MALE"),
    firmName: zod_1.z.string().max(50),
    proprietorName: zod_1.z.string().max(50),
    phoneNumber1: zod_1.z.string().max(15),
    phoneNumber2: zod_1.z.string().max(15).optional(),
    surveyNumber: zod_1.z.string().max(100),
    village: zod_1.z.string().max(50),
    zone: zod_1.z.string().max(50),
    mandal: zod_1.z.string().max(50),
    district: zod_1.z.string().max(50),
    state: zod_1.z.string().max(50),
    pinCode: zod_1.z.string().max(10),
    proprietorStatus: OwnershipType.default("OWNER"),
    proprietorType: BusinessType.default("OWNED"),
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
