"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMember = exports.validateUSCNumber = void 0;
const __1 = require("../..");
const AddMember_1 = require("../../schema/members/AddMember");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const generateMemberID_1 = require("../../utils/generateMemberID");
// import { testS3Operations } from "../../services/s3Bucket/s3test";
const validateUSCNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { electricalUscNumber } = req.body;
        const member = yield __1.prismaClient.members.findFirst({
            where: {
                membershipStatus: { not: "CANCELLED" },
                OR: [
                    { electricalUscNumber },
                    {
                        branches: {
                            some: {
                                electricalUscNumber,
                            },
                        },
                    },
                ],
            },
            include: {
                branches: true,
            },
        });
        if (member) {
            if (member.electricalUscNumber === electricalUscNumber) {
                res.json({ isMember: true, message: "Already a member" });
            }
            else {
                const matchingBranch = member.branches.find((branch) => branch.electricalUscNumber === electricalUscNumber);
                if (matchingBranch) {
                    res.json({
                        isMember: true,
                        membershipId: member.membershipId,
                        message: `Branch of member ${member.membershipId} `,
                    });
                }
                else {
                    res.json({ isMember: false, message: "Not a member" });
                }
            }
        }
        res.json({ isMember: false, message: "Not a member" });
    }
    catch (e) {
        next(new bad_request_1.BadRequestsException("Error while validating USC number", root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.validateUSCNumber = validateUSCNumber;
const addMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const memberDetails = AddMember_1.MemberSignUpSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            //Create a member
            const newMember = yield addMemberHandler(prisma, memberDetails, req.user);
            const partnerDetails = yield addPartnerDetailsHandler(prisma, newMember.membershipId, memberDetails.partnerDetails);
            const machineryInformations = yield addMachineryInformationsHandler(prisma, newMember.membershipId, memberDetails.machineryInformations);
            //Add branches
            const branches = yield addBranchesHandler(prisma, newMember.membershipId, memberDetails.branches);
            //Add complianceDetails
            const complianceDetails = yield addComplianceDetailsHandler(prisma, newMember.membershipId, memberDetails.complianceDetails);
            //Add SimilarMembershipInquiry
            const similarMembershipInquiry = yield addSimilarMembershipInquiryHandler(prisma, newMember.membershipId, memberDetails.similarMembershipInquiry);
            //ADD Attachments
            const attachments = yield addAttachmentsHandler(prisma, newMember.membershipId, memberDetails.attachments);
            const proposer = yield addProposerHandler(prisma, newMember.membershipId, memberDetails.proposer);
            const executiveProposer = yield addExecutiveProposersHandler(prisma, newMember.membershipId, memberDetails.executiveProposer);
            const declarations = yield addDeclarationsHandler(prisma, newMember.membershipId, memberDetails.declarations);
            return {
                newMember,
                partnerDetails,
                machineryInformations,
                branches,
                complianceDetails,
                similarMembershipInquiry,
                attachments,
                proposer,
                executiveProposer,
                declarations,
            };
        }), { timeout: 20000 });
        res.status(200).json(result);
    }
    catch (e) {
        console.error("inside catch", e.code);
        if (e.code === 'P2002') {
            // return res.status(400).json({ error: `Duplicate value for ${e.meta?.target}` });
            return next(new bad_request_1.BadRequestsException(`Duplicate value for ${(_a = e.meta) === null || _a === void 0 ? void 0 : _a.target}`, root_1.ErrorCode.BAD_REQUEST));
        }
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addMember = addMember;
const addMemberHandler = (prisma, memberDetails, user) => __awaiter(void 0, void 0, void 0, function* () {
    const customId = yield (0, generateMemberID_1.generateCustomMemberId)(prisma);
    const data = {
        membershipId: customId,
        doj: memberDetails.doj,
        electricalUscNumber: memberDetails.electricalUscNumber,
        scNumber: memberDetails.scNumber,
        applicantName: memberDetails.applicantName,
        relation: memberDetails.relation,
        relativeName: memberDetails.relativeName,
        gender: memberDetails.gender,
        firmName: memberDetails.firmName,
        proprietorName: memberDetails.proprietorName,
        proprietorStatus: memberDetails.proprietorStatus,
        proprietorType: memberDetails.proprietorType,
        phoneNumber1: memberDetails.phoneNumber1,
        phoneNumber2: memberDetails.phoneNumber2,
        surveyNumber: memberDetails.surveyNumber,
        village: memberDetails.village,
        zone: memberDetails.zone,
        mandal: memberDetails.mandal,
        district: memberDetails.district,
        state: memberDetails.state,
        pinCode: memberDetails.pinCode,
        sanctionedHP: memberDetails.sanctionedHP,
        estimatedMaleWorker: memberDetails.estimatedMaleWorker,
        estimatedFemaleWorker: memberDetails.estimatedFemaleWorker,
    };
    if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN") {
        // let nextDueDate = new Date();
        // nextDueDate = new Date(nextDueDate); // Clone approvedDate
        // nextDueDate.setFullYear(nextDueDate.getFullYear() + 1); // Set next year
        Object.assign(data, {
            approvalStatus: "APPROVED",
            isPaymentDue: "FALSE",
            membershipStatus: "ACTIVE",
            approvedOrDeclinedBy: user.userId,
            approvedOrDeclinedAt: new Date(),
        });
    }
    return yield prisma.members.create({ data });
});
const addMachineryInformationsHandler = (prisma, membershipId, machineryInformations) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(machineryInformations === null || machineryInformations === void 0 ? void 0 : machineryInformations.length))
        return [];
    const createdRecords = yield Promise.all(machineryInformations.map((machine) => {
        var _a;
        return prisma.machineryInformations.create({
            data: {
                membershipId,
                machineName: machine.machineName,
                machineCount: machine.machineCount,
                branchId: (_a = machine.branchId) !== null && _a !== void 0 ? _a : null,
            },
        });
    }));
    return createdRecords;
});
const addBranchesHandler = (prisma, membershipId, branches) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(branches.map((branch) => __awaiter(void 0, void 0, void 0, function* () {
        const newBranch = yield prisma.branches.create({
            data: {
                membershipId,
                electricalUscNumber: branch.electricalUscNumber,
                scNumber: branch.scNumber,
                proprietorType: branch.proprietorType,
                proprietorStatus: branch.proprietorStatus,
                sanctionedHP: branch.sanctionedHP,
                placeOfBusiness: branch.placeOfBusiness,
            },
        });
        const machineryData = branch.machineryInformations.map((machine) => ({
            // membershipId,
            branchId: newBranch.id,
            machineName: machine.machineName,
            machineCount: machine.machineCount,
        }));
        const createdMachineries = yield prisma.machineryInformations.createMany({
            data: machineryData,
        });
        return Object.assign(Object.assign({}, newBranch), { machineryInformations: machineryData });
    })));
});
const addComplianceDetailsHandler = (prisma, membershipId, complianceDetails) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.complianceDetails.create({
        data: Object.assign({ membershipId }, complianceDetails),
    });
});
const addSimilarMembershipInquiryHandler = (prisma, membershipId, similarMembershipInquiry) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.similarMembershipInquiry.create({
        data: Object.assign({ membershipId }, similarMembershipInquiry),
    });
});
const addAttachmentsHandler = (prisma, membershipId, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(attachments.map((attachment) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.attachments.create({
            data: {
                membershipId,
                documentName: attachment.documentName,
                documentPath: attachment.documentPath,
            },
        });
    })));
});
const addProposerHandler = (prisma, membershipId, proposers) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.proposer.create({
        data: {
            membershipId,
            proposerID: proposers.proposerID,
            signaturePath: proposers.signaturePath,
        },
    });
});
const addExecutiveProposersHandler = (prisma, membershipId, executiveProposer) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.executiveProposer.create({
        data: {
            membershipId,
            proposerID: executiveProposer.proposerID,
            signaturePath: executiveProposer.signaturePath,
        },
    });
});
const addDeclarationsHandler = (prisma, membershipId, declarations) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.declarations.create({
        data: {
            membershipId,
            agreesToTerms: declarations.agreesToTerms,
            membershipFormPath: declarations.membershipFormPath,
            applicationSignaturePath: declarations.applicationSignaturePath,
        },
    });
});
const addPartnerDetailsHandler = (prisma, membershipId, partnerDetails) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(partnerDetails.map((partner) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma.partnerDetails.create({
            data: {
                membershipId,
                partnerName: partner.partnerName,
                partnerAadharNo: partner.partnerAadharNo,
                partnerPanNo: partner.partnerPanNo,
                contactNumber: partner.contactNumber,
                emailId: partner.emailId,
            },
        });
    })));
});
// import { Request } from "../../types/express";
// import { NextFunction, Response } from "express";
// import { prismaClient } from "../..";
// import { MemberSignUpSchema } from "../../schema/members/AddMember";
// import { GuardianRelation, OwnershipType, BusinessType } from "@prisma/client";
// import { BadRequestsException } from "../../exceptions/bad-request";
// import { ErrorCode } from "../../exceptions/root";
// import { generateCustomMemberId } from "../../utils/generateMemberID";
// export const validateUSCNumber = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { electricalUscNumber } = req.body;
//     const member = await prismaClient.members.findFirst({
//       where: {
//         membershipStatus: { not: "CANCELLED" },
//         OR: [
//           { electricalUscNumber },
//           {
//             branches: {
//               some: { electricalUscNumber },
//             },
//           },
//         ],
//       },
//       include: { branches: true },
//     });
//     if (member) {
//       if (member.electricalUscNumber === electricalUscNumber) {
//         return res.json({ isMember: true, message: "Already a member" });
//       }
//       const matchingBranch = member.branches.find(
//         (b) => b.electricalUscNumber === electricalUscNumber
//       );
//       if (matchingBranch) {
//         return res.json({
//           isMember: true,
//           membershipId: member.membershipId,
//           message: `Branch of member ${member.membershipId}`,
//         });
//       }
//       return res.json({ isMember: false, message: "Not a member" });
//     }
//     return res.json({ isMember: false, message: "Not a member" });
//   } catch (e) {
//     next(
//       new BadRequestsException(
//         "Error while validating USC number",
//         ErrorCode.BAD_REQUEST
//       )
//     );
//   }
// };
// export const addMember = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let memberDetails;
//   try {
//     memberDetails = MemberSignUpSchema.parse(req.body);
//   } catch (err: any) {
//     return next(new BadRequestsException(err.message, ErrorCode.BAD_REQUEST));
//   }
//   try {
//     if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
//       return next(
//         new BadRequestsException("Unauthorized", ErrorCode.UNAUTHORIZED)
//       );
//     }
//     const result = await prismaClient.$transaction(async (prisma) => {
//       // Create member
//       const newMember = await addMemberHandler(prisma, memberDetails, req.user);
//       // Prepare promises for all other related creations in parallel
//       const partnerPromise = addPartnerDetailsHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.partnerDetails
//       );
//       const machineryPromise = addMachineryInformationsHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.machineryInformations
//       );
//       const branchesPromise = addBranchesHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.branches
//       );
//       const compliancePromise = addComplianceDetailsHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.complianceDetails
//       );
//       const similarInquiryPromise = addSimilarMembershipInquiryHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.similarMembershipInquiry
//       );
//       const attachmentsPromise = addAttachmentsHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.attachments
//       );
//       const proposerPromise = addProposerHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.proposer
//       );
//       const executiveProposerPromise = addExecutiveProposersHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.executiveProposer
//       );
//       const declarationsPromise = addDeclarationsHandler(
//         prisma,
//         newMember.membershipId,
//         memberDetails.declarations
//       );
//       // Await all promises in parallel
//       const [
//         partnerDetails,
//         machineryInformations,
//         branches,
//         complianceDetails,
//         similarMembershipInquiry,
//         attachments,
//         proposer,
//         executiveProposer,
//         declarations,
//       ] = await Promise.all([
//         partnerPromise,
//         machineryPromise,
//         branchesPromise,
//         compliancePromise,
//         similarInquiryPromise,
//         attachmentsPromise,
//         proposerPromise,
//         executiveProposerPromise,
//         declarationsPromise,
//       ]);
//       return {
//         newMember,
//         partnerDetails,
//         machineryInformations,
//         branches,
//         complianceDetails,
//         similarMembershipInquiry,
//         attachments,
//         proposer,
//         executiveProposer,
//         declarations,
//       };
//     }, { timeout: 20000 });
//     res.status(200).json(result);
//   } catch (e: any) {
//     console.error("inside catch", e.code);
//     if (e.code === "P2002") {
//       return next(
//         new BadRequestsException(
//           `Duplicate value for ${e.meta?.target}`,
//           ErrorCode.BAD_REQUEST
//         )
//       );
//     }
//     return next(new BadRequestsException(e.message, ErrorCode.BAD_REQUEST));
//   }
// };
// const addMemberHandler = async (
//   prisma: any,
//   memberDetails: any,
//   user: any
// ) => {
//   const customId = await generateCustomMemberId(prisma);
//   const data: any = {
//     membershipId: customId,
//     doj: memberDetails.doj,
//     electricalUscNumber: memberDetails.electricalUscNumber,
//     scNumber: memberDetails.scNumber,
//     applicantName: memberDetails.applicantName,
//     relation: memberDetails.relation as GuardianRelation,
//     relativeName: memberDetails.relativeName,
//     gender: memberDetails.gender,
//     firmName: memberDetails.firmName,
//     proprietorName: memberDetails.proprietorName,
//     proprietorStatus: memberDetails.proprietorStatus as OwnershipType,
//     proprietorType: memberDetails.proprietorType as BusinessType,
//     phoneNumber1: memberDetails.phoneNumber1,
//     phoneNumber2: memberDetails.phoneNumber2,
//     surveyNumber: memberDetails.surveyNumber,
//     village: memberDetails.village,
//     zone: memberDetails.zone,
//     mandal: memberDetails.mandal,
//     district: memberDetails.district,
//     state: memberDetails.state,
//     pinCode: memberDetails.pinCode,
//     sanctionedHP: memberDetails.sanctionedHP,
//     estimatedMaleWorker: memberDetails.estimatedMaleWorker,
//     estimatedFemaleWorker: memberDetails.estimatedFemaleWorker,
//   };
//   if (user?.role === "ADMIN") {
//     Object.assign(data, {
//       approvalStatus: "APPROVED",
//       isPaymentDue: "FALSE",
//       membershipStatus: "ACTIVE",
//       approvedOrDeclinedBy: user.userId,
//       approvedOrDeclinedAt: new Date(),
//     });
//   }
//   return prisma.members.create({ data });
// };
// const addMachineryInformationsHandler = async (
//   prisma: any,
//   membershipId: string,
//   machineryInformations: Array<{
//     machineName: string;
//     machineCount: number;
//     branchId?: number;
//   }>
// ) => {
//   if (!machineryInformations?.length) return [];
//   // Use createMany for bulk insert (fast)
//   const data = machineryInformations.map((m) => ({
//     membershipId,
//     machineName: m.machineName,
//     machineCount: m.machineCount,
//     branchId: m.branchId ?? null,
//   }));
//   await prisma.machineryInformations.createMany({ data });
//   // Return full created records by fetching again if needed or just return input data
//   return data;
// };
// const addBranchesHandler = async (
//   prisma: any,
//   membershipId: string,
//   branches: Array<{
//     electricalUscNumber: string;
//     scNumber: string;
//     proprietorType: string;
//     proprietorStatus: string;
//     sanctionedHP: number;
//     placeOfBusiness: string;
//     machineryInformations: Array<{
//       machineName: string;
//       machineCount: number;
//     }>;
//   }>
// ) => {
//   if (!branches?.length) return [];
//   // First create branches in bulk (without machinery)
//   const branchData = branches.map((b) => ({
//     membershipId,
//     electricalUscNumber: b.electricalUscNumber,
//     scNumber: b.scNumber,
//     proprietorType: b.proprietorType,
//     proprietorStatus: b.proprietorStatus,
//     sanctionedHP: b.sanctionedHP,
//     placeOfBusiness: b.placeOfBusiness,
//   }));
//   const createdBranches = await Promise.all(
//     branchData.map((b) =>
//       prisma.branches.create({
//         data: b,
//       })
//     )
//   );
//   // Prepare all machinery inserts with branchId attached
//   const allMachinery: any[] = [];
//   createdBranches.forEach((branch, idx) => {
//     const machines = branches[idx].machineryInformations || [];
//     machines.forEach((m) => {
//       allMachinery.push({
//         branchId: branch.id,
//         machineName: m.machineName,
//         machineCount: m.machineCount,
//       });
//     });
//   });
//   // Bulk insert all machinery
//   if (allMachinery.length) {
//     await prisma.machineryInformations.createMany({ data: allMachinery });
//   }
//   // Attach machinery to branches in the return object
//   const branchesWithMachinery = createdBranches.map((branch) => ({
//     ...branch,
//     machineryInformations: allMachinery.filter(
//       (m) => m.branchId === branch.id
//     ),
//   }));
//   return branchesWithMachinery;
// };
// const addComplianceDetailsHandler = async (
//   prisma: any,
//   membershipId: string,
//   complianceDetails: any
// ) => {
//   return prisma.complianceDetails.create({
//     data: {
//       membershipId,
//       ...complianceDetails,
//     },
//   });
// };
// const addSimilarMembershipInquiryHandler = async (
//   prisma: any,
//   membershipId: string,
//   similarMembershipInquiry: any
// ) => {
//   return prisma.similarMembershipInquiry.create({
//     data: {
//       membershipId,
//       ...similarMembershipInquiry,
//     },
//   });
// };
// const addAttachmentsHandler = async (
//   prisma: any,
//   membershipId: string,
//   attachments: any
// ) => {
//   if (!attachments?.length) return [];
//   // Bulk create attachments
//   await prisma.attachments.createMany({
//     data: attachments.map((a: any) => ({
//       membershipId,
//       documentName: a.documentName,
//       documentPath: a.documentPath,
//     })),
//   });
//   return attachments;
// };
// const addProposerHandler = async (
//   prisma: any,
//   membershipId: string,
//   proposers: any
// ) => {
//   return prisma.proposer.create({
//     data: {
//       membershipId,
//       proposerID: proposers.proposerID,
//       signaturePath: proposers.signaturePath,
//     },
//   });
// };
// const addExecutiveProposersHandler = async (
//   prisma: any,
//   membershipId: string,
//   executiveProposer: any
// ) => {
//   return prisma.executiveProposer.create({
//     data: {
//       membershipId,
//       proposerID: executiveProposer.proposerID,
//       signaturePath: executiveProposer.signaturePath,
//     },
//   });
// };
// const addDeclarationsHandler = async (
//   prisma: any,
//   membershipId: string,
//   declarations: any
// ) => {
//   return prisma.declarations.create({
//     data: {
//       membershipId,
//       agreesToTerms: declarations.agreesToTerms,
//       membershipFormPath: declarations.membershipFormPath,
//       applicationSignaturePath: declarations.applicationSignaturePath,
//     },
//   });
// };
// const addPartnerDetailsHandler = async (
//   prisma: any,
//   membershipId: string,
//   partnerDetails: Array<{
//     partnerName: string;
//     partnerAadharNo: string;
//     partnerPanNo: string;
//     contactNumber: string;
//     emailId: string;
//   }>
// ) => {
//   if (!partnerDetails?.length) return [];
//   // Bulk insert partners
//   await prisma.partnerDetails.createMany({
//     data: partnerDetails.map((p) => ({
//       membershipId,
//       partnerName: p.partnerName,
//       partnerAadharNo: p.partnerAadharNo,
//       partnerPanNo: p.partnerPanNo,
//       contactNumber: p.contactNumber,
//       emailId: p.emailId,
//     })),
//   });
//   return partnerDetails;
// };
