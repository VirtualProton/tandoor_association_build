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
                                electricalUscNumber
                            }
                        }
                    }
                ]
            },
            include: {
                branches: true
            }
        });
        if (member) {
            if (member.electricalUscNumber === electricalUscNumber) {
                res.json({ isMember: true, message: "Already a member" });
            }
            else {
                const matchingBranch = member.branches.find((branch) => branch.electricalUscNumber === electricalUscNumber);
                if (matchingBranch) {
                    res.json({ isMember: true, membershipId: member.membershipId, message: `Branch of member ${member.membershipId} ` });
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
    const memberDetails = AddMember_1.MemberSignUpSchema.parse(req.body);
    try {
        if (!["TSMWA_EDITOR", "TQMA_EDITOR", "ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const result = yield __1.prismaClient.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            //Create a member
            const newMember = yield addMemberHandler(prisma, memberDetails, req.user);
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
            return { newMember, machineryInformations, branches, complianceDetails, similarMembershipInquiry, attachments, proposer, executiveProposer, declarations };
        }));
        res.status(200).json(result);
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.addMember = addMember;
const addMemberHandler = (prisma, memberDetails, user) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        electricalUscNumber: memberDetails.electricalUscNumber,
        applicantName: memberDetails.applicantName,
        guardianRelation: memberDetails.guardianRelation,
        guardianName: memberDetails.guardianName,
        gender: memberDetails.gender,
        firmName: memberDetails.firmName,
        proprietorName: memberDetails.proprietorName,
        officeNumber: memberDetails.officeNumber,
        phoneNumber1: memberDetails.phoneNumber1,
        phoneNumber2: memberDetails.phoneNumber2,
        surveyNumber: memberDetails.surveyNumber,
        village: memberDetails.village,
        zone: memberDetails.zone,
        ownershipType: memberDetails.ownershipType,
        businessType: memberDetails.businessType,
        sanctionedHP: memberDetails.sanctionedHP,
        estimatedMaleWorker: memberDetails.estimatedMaleWorker,
        estimatedFemaleWorker: memberDetails.estimatedFemaleWorker,
    };
    if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN") {
        let nextDueDate = new Date();
        nextDueDate = new Date(nextDueDate); // Clone approvedDate
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1); // Set next year
        Object.assign(data, {
            approvalStatus: "APPROVED",
            membershipStatus: "ACTIVE",
            nextDueDate: nextDueDate,
            approvedOrDeclinedBy: user.userId,
            approvedOrDeclinedAt: new Date(),
        });
    }
    return yield prisma.members.create({ data });
});
const addMachineryInformationsHandler = (prisma, membershipId, machineryInformations) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.machineryInformations.create({
        data: {
            membershipId,
            highPolishMachine: machineryInformations.highPolishMachine,
            sliceMachine: machineryInformations.highPolishMachine,
            cuttingMachine: machineryInformations.highPolishMachine,
            other: machineryInformations.highPolishMachine,
        },
    });
});
const addBranchesHandler = (prisma, membershipId, branches) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(branches.map((branch) => __awaiter(void 0, void 0, void 0, function* () {
        const newBranch = yield prisma.branches.create({
            data: {
                membershipId: membershipId,
                electricalUscNumber: branch.electricalUscNumber,
                surveyNumber: branch.surveyNumber,
                village: branch.village,
                zone: branch.zone,
                ownershipType: branch.ownershipType,
                businessType: branch.businessType,
                sanctionedHP: branch.sanctionedHP,
            },
        });
        const machineryInformations = yield prisma.machineryInformations.create({
            data: {
                // membershipId: membershipId,
                branchId: newBranch.id,
                highPolishMachine: branch.machineryInformations.highPolishMachine,
                sliceMachine: branch.machineryInformations.highPolishMachine,
                cuttingMachine: branch.machineryInformations.highPolishMachine,
                other: branch.machineryInformations.highPolishMachine,
            },
        });
        newBranch['machineryInformations'] = machineryInformations;
        return newBranch;
    })));
});
const addComplianceDetailsHandler = (prisma, membershipId, complianceDetails) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.complianceDetails.create({
        data: {
            membershipId,
            gstinNumber: complianceDetails.gstinNumber,
            factoryLicenseNumber: complianceDetails.factoryLicenseNumber,
            tspcbOrderNumber: complianceDetails.tspcbOrderNumber,
            mdlNumber: complianceDetails.mdlNumber,
            udyamCertificateNumber: complianceDetails.udyamCertificateNumber,
            fullAddress: complianceDetails.fullAddress,
            partnerName: complianceDetails.partnerName,
            contactNumber: complianceDetails.contactNumber,
            AadharNumber: complianceDetails.AadharNumber,
        },
    });
});
const addSimilarMembershipInquiryHandler = (prisma, membershipId, similarMembershipInquiry) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.similarMembershipInquiry.create({
        data: {
            membershipId,
            isSimilarMember: similarMembershipInquiry.isSimilarMember,
            previousMembershipDetails: similarMembershipInquiry.isSimilarMember,
        },
    });
});
const addAttachmentsHandler = (prisma, membershipId, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.attachments.create({
        data: {
            membershipId,
            attachmentType: attachments.attachmentType,
            filePath: attachments.filePath,
        },
    });
});
const addProposerHandler = (prisma, membershipId, proposers) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.proposer.create({
        data: {
            membershipId,
            proposerType: proposers.proposerId,
            signaturePath: proposers.signaturePath,
        },
    });
});
const addExecutiveProposersHandler = (prisma, membershipId, executiveProposer) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.executiveProposer.create({
        data: {
            membershipId,
            proposerType: executiveProposer.proposerId,
            signaturePath: executiveProposer.signaturePath,
        }
    });
});
const addDeclarationsHandler = (prisma, membershipId, declarations) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.declarations.create({
        data: {
            membershipId,
            agreesToTerms: declarations.agreesToTerms,
            partnerPhotoPath: declarations.partnerPhotoPath,
            applicationSignaturePath: declarations.partnerPhotoPath,
        },
    });
});
