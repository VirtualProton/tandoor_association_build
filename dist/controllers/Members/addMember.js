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
const addMember_1 = require("../../schema/members/addMember");
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
    const memberDetails = addMember_1.MemberSignUpSchema.parse(req.body);
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
        }), { timeout: 20000 });
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
        scNumber: memberDetails.scNumber,
        applicantName: memberDetails.applicantName,
        relation: memberDetails.relation,
        relativeName: memberDetails.relativeName,
        gender: memberDetails.gender,
        firmName: memberDetails.firmName,
        partnerName: memberDetails.partnerName,
        partnerStatus: memberDetails.partnerStatus,
        partnerType: memberDetails.partnerType,
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
            nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
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
            sliceMachine: machineryInformations.sliceMachine,
            cuttingMachine: machineryInformations.cuttingMachine,
            other: machineryInformations.other,
        },
    });
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
        const machineryInformations = yield prisma.machineryInformations.create({
            data: {
                // membershipId: membershipId,
                branchId: newBranch.id,
                highPolishMachine: branch.machineryInformations.highPolishMachine,
                sliceMachine: branch.machineryInformations.sliceMachine,
                cuttingMachine: branch.machineryInformations.cuttingMachine,
                other: branch.machineryInformations.other,
            },
        });
        newBranch['machineryInformations'] = machineryInformations;
        return newBranch;
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
        }
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
