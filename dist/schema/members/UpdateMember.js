"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberUpdateSchema = void 0;
const zod_1 = require("zod");
// Enums (updated)
const GuardianRelation = zod_1.z.enum(["SO", "DO", "WO"]);
const Gender = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const OwnershipType = zod_1.z.enum(["OWNER", "TENANT", "TRADER"]);
const BusinessType = zod_1.z.enum(["OWNED", "RENTED", "TRADER", "FACTORY_GIVEN_ON_LEASE"]);
// const AttachmentType = z.enum(["SALE_DEED", "RENT_AGREEMENT", "OTHER"]);
const Bool = zod_1.z.enum(["TRUE", "FALSE"]);
// Proposer Schema
const Proposer = zod_1.z.object({
    proposerId: zod_1.z.string().nullable().optional(),
    signaturePath: zod_1.z.string().nullable().optional(),
});
// Machinery Info Schema
const newMachineryInformations = zod_1.z.object({
    machineName: zod_1.z.string().max(50),
    machineCount: zod_1.z.number().int().default(0)
});
const updateMachineryInformations = zod_1.z.object({
    id: zod_1.z.number(),
    machineName: zod_1.z.string().max(50).optional(),
    machineCount: zod_1.z.number().int().optional(),
}).refine((data) => data.machineName !== undefined ||
    data.machineCount !== undefined, { message: "At least one field (other than id) must be provided for Machinary update." });
const deleteMachineryInformations = zod_1.z.object({
    id: zod_1.z.number()
});
// Partner Details Schema
const newPartnerDetails = zod_1.z.object({
    partnerName: zod_1.z.string().max(50),
    partnerAadharNo: zod_1.z.string().max(15),
    partnerPanNo: zod_1.z.string().max(12),
    contactNumber: zod_1.z.string().max(10),
    emailId: zod_1.z.string().max(50),
});
const updatePartnerDetails = zod_1.z.object({
    id: zod_1.z.number(),
    partnerName: zod_1.z.string().max(50).optional(),
    partnerAadharNo: zod_1.z.string().max(15).optional(),
    partnerPanNo: zod_1.z.string().max(12).optional(),
    contactNumber: zod_1.z.string().max(10).optional(),
    emailId: zod_1.z.string().max(50).optional(),
}).refine((data) => data.partnerName !== undefined ||
    data.partnerAadharNo !== undefined ||
    data.partnerPanNo !== undefined ||
    data.contactNumber !== undefined ||
    data.emailId !== undefined, { message: "At least one field (other than id) must be provided for update." });
const deletePartnerDetails = zod_1.z.object({
    id: zod_1.z.number()
});
// Branch Schema
const newBranchSchema = zod_1.z.object({
    electricalUscNumber: zod_1.z.string(),
    scNumber: zod_1.z.string(),
    proprietorType: zod_1.z.string(),
    proprietorStatus: zod_1.z.string(),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }),
    placeOfBusiness: zod_1.z.string().max(50),
    machineryInformations: zod_1.z.array(newMachineryInformations).default([]),
});
const updateBranchSchema = zod_1.z.object({
    id: zod_1.z.number(),
    electricalUscNumber: zod_1.z.string().optional(),
    scNumber: zod_1.z.string().optional(),
    proprietorType: zod_1.z.string().optional(),
    proprietorStatus: zod_1.z.string().optional(),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }).optional(),
    placeOfBusiness: zod_1.z.string().max(50).optional(),
    newMachineryInformations: zod_1.z.array(newMachineryInformations).default([]).optional(),
    updateMachineryInformations: zod_1.z.array(updateMachineryInformations).default([]).optional(),
    deleteMachineryInformations: zod_1.z.array(deleteMachineryInformations).default([]).optional(),
}).refine((data) => data.electricalUscNumber !== undefined ||
    data.scNumber !== undefined ||
    data.proprietorType !== undefined ||
    data.proprietorStatus !== undefined ||
    data.sanctionedHP !== undefined ||
    data.placeOfBusiness !== undefined ||
    (data.newMachineryInformations && data.newMachineryInformations.length > 0) ||
    (data.updateMachineryInformations && data.updateMachineryInformations.length > 0) ||
    (data.deleteMachineryInformations && data.deleteMachineryInformations.length > 0), { message: "At least one field (other than id) must be provided for Branch update." });
const deleteBranchSchema = zod_1.z.object({
    id: zod_1.z.number()
});
// Compliance Details Schema
const ComplianceDetails = zod_1.z.object({
    gstInNumber: zod_1.z.string().max(50).optional(),
    gstInCertificatePath: zod_1.z.string().max(225).optional(),
    gstExpiredAt: zod_1.z.coerce.date().optional(),
    factoryLicenseNumber: zod_1.z.string().max(50).optional(),
    factoryLicensePath: zod_1.z.string().max(225).optional(),
    factoryLicenseExpiredAt: zod_1.z.coerce.date().optional(),
    tspcbOrderNumber: zod_1.z.string().max(50).optional(),
    tspcbCertificatePath: zod_1.z.string().max(225).optional(),
    tspcbExpiredAt: zod_1.z.coerce.date().optional(),
    mdlNumber: zod_1.z.string().max(50).optional(),
    mdlCertificatePath: zod_1.z.string().max(225).optional(),
    mdlExpiredAt: zod_1.z.coerce.date().optional(),
    udyamCertificateNumber: zod_1.z.string().max(50).optional(),
    udyamCertificatePath: zod_1.z.string().max(225).optional(),
    udyamCertificateExpiredAt: zod_1.z.coerce.date().optional(),
    fullAddress: zod_1.z.string().max(225).optional(),
    partnerName: zod_1.z.string().max(50).optional(),
    contactNumber: zod_1.z.string().max(13).optional(),
    AadharNumber: zod_1.z.string().max(15).optional(),
    emailId: zod_1.z.string().max(50).optional(),
    panNumber: zod_1.z.string().max(12).optional(),
}).refine((data) => data.gstInNumber !== undefined ||
    data.gstInCertificatePath !== undefined ||
    data.factoryLicenseNumber !== undefined ||
    data.factoryLicensePath !== undefined ||
    data.tspcbOrderNumber !== undefined ||
    data.tspcbCertificatePath !== undefined ||
    data.mdlNumber !== undefined ||
    data.mdlCertificatePath !== undefined ||
    data.udyamCertificateNumber !== undefined ||
    data.udyamCertificatePath !== undefined ||
    data.fullAddress !== undefined ||
    data.partnerName !== undefined ||
    data.contactNumber !== undefined ||
    data.AadharNumber !== undefined ||
    data.emailId !== undefined ||
    data.panNumber !== undefined, { message: "At least one field must be provided for ComplianceDetails update." });
// Similar Membership Inquiry
const SimilarMembershipInquiry = zod_1.z.object({
    is_member_of_similar_org: Bool.optional(),
    has_applied_earlier: Bool.optional(),
    is_valid_member: Bool.optional(),
    is_executive_member: Bool.optional(),
}).refine((data) => data.is_member_of_similar_org !== undefined ||
    data.has_applied_earlier !== undefined ||
    data.is_valid_member !== undefined ||
    data.is_executive_member !== undefined, { message: "At least one field must be provided for SimilarMembershipInquiry update." });
// Attachments Schema
const newAttachments = zod_1.z.object({
    documentName: zod_1.z.string().max(50),
    documentPath: zod_1.z.string().max(225),
    expiredAt: zod_1.z.coerce.date().optional(),
});
const updateAttachments = zod_1.z.object({
    id: zod_1.z.number(),
    documentName: zod_1.z.string().max(50).optional(),
    documentPath: zod_1.z.string().max(225).optional(),
    expiredAt: zod_1.z.coerce.date().optional(),
}).refine((data) => data.documentName !== undefined ||
    data.documentPath !== undefined ||
    data.expiredAt !== undefined, { message: "At least one field (other than id) must be provided for Attachment update." });
const deleteAttachments = zod_1.z.object({
    id: zod_1.z.number()
});
// Declarations
const Declarations = zod_1.z.object({
    agreesToTerms: Bool.optional(),
    membershipFormPath: zod_1.z.string().max(225).optional(),
    applicationSignaturePath: zod_1.z.string().max(225).optional(),
}).refine((data) => data.agreesToTerms !== undefined ||
    data.membershipFormPath !== undefined ||
    data.applicationSignaturePath !== undefined, { message: "At least one field must be provided for Declarations update." });
// Member Update Schema
exports.MemberUpdateSchema = zod_1.z.object({
    membershipId: zod_1.z.string(),
    scNumber: zod_1.z.string().optional(),
    electricalUscNumber: zod_1.z.string().optional(),
    doj: zod_1.z.coerce.date().optional(),
    applicantName: zod_1.z.string().max(50).optional(),
    relation: GuardianRelation.optional(),
    relativeName: zod_1.z.string().max(50).optional(),
    gender: Gender.optional(),
    firmName: zod_1.z.string().max(50).optional(),
    partnerName: zod_1.z.string().max(50).optional(),
    officeNumber: zod_1.z.string().max(15).optional(),
    phoneNumber1: zod_1.z.string().max(15).optional(),
    phoneNumber2: zod_1.z.string().max(15).optional(),
    surveyNumber: zod_1.z.string().max(100).optional(),
    village: zod_1.z.string().max(50).optional(),
    zone: zod_1.z.string().max(50).optional(),
    ownershipType: OwnershipType.optional(),
    businessType: BusinessType.optional(),
    sanctionedHP: zod_1.z.number().refine((val) => val >= 0, {
        message: "Sanctioned HP must be a positive decimal",
    }).optional(),
    partnerDetails: zod_1.z.object({
        newPartnerDetails: zod_1.z.array(newPartnerDetails).default([]).optional(),
        updatePartnerDetails: zod_1.z.array(updatePartnerDetails).default([]).optional(),
        deletePartnerDetails: zod_1.z.array(deletePartnerDetails).default([]).optional(),
    }).optional(),
    estimatedMaleWorker: zod_1.z.number().int().optional(),
    estimatedFemaleWorker: zod_1.z.number().int().optional(),
    machineryInformations: zod_1.z.object({
        newMachineryInformations: zod_1.z.array(newMachineryInformations).default([]).optional(),
        updateMachineryInformations: zod_1.z.array(updateMachineryInformations).default([]).optional(),
        deleteMachineryInformations: zod_1.z.array(deleteMachineryInformations).default([]).optional(),
    }).optional(),
    branchDetails: zod_1.z.object({
        newBranchSchema: zod_1.z.array(newBranchSchema).default([]).optional(),
        updateBranchSchema: zod_1.z.array(updateBranchSchema).default([]).optional(),
        deleteBranchSchema: zod_1.z.array(deleteBranchSchema).default([]).optional(),
    }).optional(),
    complianceDetails: ComplianceDetails.optional(),
    similarMembershipInquiry: SimilarMembershipInquiry.optional(),
    attachments: zod_1.z.object({
        newAttachments: zod_1.z.array(newAttachments).default([]).optional(),
        updateAttachments: zod_1.z.array(updateAttachments).default([]).optional(),
        deleteAttachments: zod_1.z.array(deleteAttachments).default([]).optional(),
    }).optional(),
    proposer: Proposer.optional(),
    executiveProposer: Proposer.optional(),
    declarations: Declarations.optional(),
}).refine((data) => data.scNumber !== undefined ||
    data.electricalUscNumber !== undefined ||
    data.doj !== undefined ||
    data.applicantName !== undefined ||
    data.relation !== undefined ||
    data.relativeName !== undefined ||
    data.gender !== undefined ||
    data.firmName !== undefined ||
    data.partnerName !== undefined ||
    data.officeNumber !== undefined ||
    data.phoneNumber1 !== undefined ||
    data.phoneNumber2 !== undefined ||
    data.surveyNumber !== undefined ||
    data.village !== undefined ||
    data.zone !== undefined ||
    data.ownershipType !== undefined ||
    data.businessType !== undefined ||
    data.sanctionedHP !== undefined ||
    (data.partnerDetails &&
        ((data.partnerDetails.newPartnerDetails && data.partnerDetails.newPartnerDetails.length > 0) ||
            (data.partnerDetails.updatePartnerDetails && data.partnerDetails.updatePartnerDetails.length > 0) ||
            (data.partnerDetails.deletePartnerDetails && data.partnerDetails.deletePartnerDetails.length > 0))) ||
    data.estimatedMaleWorker !== undefined ||
    data.estimatedFemaleWorker !== undefined ||
    (data.machineryInformations &&
        ((data.machineryInformations.newMachineryInformations && data.machineryInformations.newMachineryInformations.length > 0) ||
            (data.machineryInformations.updateMachineryInformations && data.machineryInformations.updateMachineryInformations.length > 0) ||
            (data.machineryInformations.deleteMachineryInformations && data.machineryInformations.deleteMachineryInformations.length > 0))) ||
    (data.branchDetails &&
        ((data.branchDetails.newBranchSchema && data.branchDetails.newBranchSchema.length > 0) ||
            (data.branchDetails.updateBranchSchema && data.branchDetails.updateBranchSchema.length > 0) ||
            (data.branchDetails.deleteBranchSchema && data.branchDetails.deleteBranchSchema.length > 0))) ||
    data.complianceDetails !== undefined ||
    data.similarMembershipInquiry !== undefined ||
    (data.attachments &&
        ((data.attachments.newAttachments && data.attachments.newAttachments.length > 0) ||
            (data.attachments.updateAttachments && data.attachments.updateAttachments.length > 0) ||
            (data.attachments.deleteAttachments && data.attachments.deleteAttachments.length > 0))) ||
    data.proposer !== undefined ||
    data.executiveProposer !== undefined ||
    data.declarations !== undefined, { message: "At least one field (other than membershipId) must be provided for Member update." });
