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
exports.addMember = exports.validateComplianceNumber = exports.validateUSCAndScNumber = void 0;
const __1 = require("../..");
const AddMember_1 = require("../../schema/members/AddMember");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const generateMemberID_1 = require("../../utils/generateMemberID");
// import { testS3Operations } from "../../services/s3Bucket/s3test";
const validateUSCAndScNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = {};
    try {
        const { electricalUscNumber, scNumber } = req.body;
        if (!electricalUscNumber && !scNumber) {
            return next(new bad_request_1.BadRequestsException("Electrical USC number or SC number is required", root_1.ErrorCode.BAD_REQUEST));
        }
        // Check if either electricalUscNumber or scNumber is provided
        if (electricalUscNumber && electricalUscNumber.toString().trim()) {
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
                select: {
                    membershipId: true,
                    firmName: true,
                },
            });
            if (!member) {
                response["Electrical USC number"] = {
                    isMember: false,
                    message: "Not a member",
                };
            }
            else {
                response["Electrical USC number"] = {
                    isMember: true,
                    message: "Already a member",
                    member,
                };
            }
        }
        if (scNumber && scNumber.toString().trim()) {
            const member = yield __1.prismaClient.members.findFirst({
                where: {
                    membershipStatus: { not: "CANCELLED" },
                    OR: [
                        { scNumber },
                        {
                            branches: {
                                some: {
                                    scNumber,
                                },
                            },
                        },
                    ],
                },
                select: {
                    membershipId: true,
                    firmName: true,
                },
            });
            if (!member) {
                response["SC number"] = { isMember: false, message: "Not a member" };
            }
            else {
                response["SC number"] = {
                    isMember: true,
                    message: "Already a member",
                    member,
                };
            }
        }
        res.json(response);
    }
    catch (e) {
        console.error("Error while validating USC number", e);
        next(new bad_request_1.BadRequestsException("Error while validating USC number", root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.validateUSCAndScNumber = validateUSCAndScNumber;
const validateComplianceNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const response = {};
    const { gstInNumber, factoryLicenseNumber, tspcbOrderNumber, mdlNumber, udyamCertificateNumber, } = req.body;
    try {
        if (!gstInNumber &&
            !factoryLicenseNumber &&
            !tspcbOrderNumber &&
            !mdlNumber &&
            !udyamCertificateNumber) {
            return next(new bad_request_1.BadRequestsException("At least one compliance number is required", root_1.ErrorCode.BAD_REQUEST));
        }
        if (gstInNumber && gstInNumber.toString().trim()) {
            const result = yield __1.prismaClient.complianceDetails.findFirst({
                where: {
                    gstInNumber: gstInNumber.toString().trim(),
                },
                select: {
                    membershipId: true,
                    members: {
                        select: {
                            firmName: true,
                        },
                    },
                },
            });
            if (!result) {
                response["GSTIN"] = { isMember: false, message: "Not a member" };
            }
            else {
                response["GSTIN"] = {
                    isMember: true,
                    message: "Already a member",
                    membershipId: result.membershipId,
                    firmName: (_a = result.members) === null || _a === void 0 ? void 0 : _a.firmName,
                };
            }
        }
        if (factoryLicenseNumber && factoryLicenseNumber.toString().trim()) {
            const result = yield __1.prismaClient.complianceDetails.findFirst({
                where: {
                    factoryLicenseNumber: factoryLicenseNumber.toString().trim(),
                },
                select: {
                    membershipId: true,
                    members: {
                        select: {
                            firmName: true,
                        },
                    },
                },
            });
            if (!result) {
                response["Factory License Number"] = { isMember: false, message: "Not a member" };
            }
            else {
                response["Factory License Number"] = {
                    isMember: true,
                    message: "Already a member",
                    membershipId: result.membershipId,
                    firmName: (_b = result.members) === null || _b === void 0 ? void 0 : _b.firmName,
                };
            }
        }
        if (tspcbOrderNumber && tspcbOrderNumber.toString().trim()) {
            const result = yield __1.prismaClient.complianceDetails.findFirst({
                where: {
                    tspcbOrderNumber: tspcbOrderNumber.toString().trim(),
                },
                select: {
                    membershipId: true,
                    members: {
                        select: {
                            firmName: true,
                        },
                    },
                },
            });
            if (!result) {
                response["TSPCB Order Number"] = { isMember: false, message: "Not a member" };
            }
            else {
                response["TSPCB Order Number"] = {
                    isMember: true,
                    message: "Already a member",
                    membershipId: result.membershipId,
                    firmName: (_c = result.members) === null || _c === void 0 ? void 0 : _c.firmName,
                };
            }
        }
        if (mdlNumber && mdlNumber.toString().trim()) {
            const result = yield __1.prismaClient.complianceDetails.findFirst({
                where: {
                    mdlNumber: mdlNumber.toString().trim(),
                },
                select: {
                    membershipId: true,
                    members: {
                        select: {
                            firmName: true,
                        },
                    },
                },
            });
            if (!result) {
                response["MDL Number"] = { isMember: false, message: "Not a member" };
            }
            else {
                response["MDL Number"] = {
                    isMember: true,
                    message: "Already a member",
                    membershipId: result.membershipId,
                    firmName: (_d = result.members) === null || _d === void 0 ? void 0 : _d.firmName,
                };
            }
        }
        if (udyamCertificateNumber && udyamCertificateNumber.toString().trim()) {
            const result = yield __1.prismaClient.complianceDetails.findFirst({
                where: {
                    udyamCertificateNumber: udyamCertificateNumber.toString().trim(),
                },
                select: {
                    membershipId: true,
                    members: {
                        select: {
                            firmName: true,
                        },
                    },
                },
            });
            if (!result) {
                response["Udyam Certificate Number"] = { isMember: false, message: "Not a member" };
            }
            else {
                response["Udyam Certificate Number"] = {
                    isMember: true,
                    message: "Already a member",
                    membershipId: result.membershipId,
                    firmName: (_e = result.members) === null || _e === void 0 ? void 0 : _e.firmName,
                };
            }
        }
        return res.json(response);
    }
    catch (e) {
        console.error("Error while validating compliance number", e);
        next(new bad_request_1.BadRequestsException("Error while validating compliance number", root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.validateComplianceNumber = validateComplianceNumber;
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
            const memberUscAssignmentHistory = yield addUscAssignmentHistoryHandler(prisma, newMember.membershipId, null, memberDetails.electricalUscNumber);
            const partnerDetails = yield addPartnerDetailsHandler(prisma, newMember.membershipId, memberDetails.partnerDetails);
            const machineryInformations = yield addMachineryInformationsHandler(prisma, newMember.membershipId, memberDetails.machineryInformations);
            //Add branches
            const branches = yield addBranchesHandler(prisma, newMember.membershipId, memberDetails.branches);
            const branchesUscAssignmentHistory = yield addUscAssignmentHistoryHandler(prisma, newMember.membershipId, branches, memberDetails.electricalUscNumber);
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
        if (e.code === "P2002") {
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
        membershipId: memberDetails.membershipId
            ? memberDetails.membershipId
            : customId,
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
                expiredAt: attachment.expiredAt ? new Date(attachment.expiredAt) : null,
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
const addUscAssignmentHistoryHandler = (prisma, membershipId, branchIds, electricalUscNumber) => __awaiter(void 0, void 0, void 0, function* () {
    if (branchIds == null || branchIds == undefined) {
        return yield prisma.uscAssignmentHistory.create({
            data: {
                membershipId,
                electricalUscNumber,
            },
        });
    }
    if (branchIds && branchIds.length > 0) {
        return yield prisma.uscAssignmentHistory.createMany({
            data: branchIds.map((branchId) => ({
                membershipId,
                branchId: branchId,
                electricalUscNumber,
            })),
        });
    }
});
