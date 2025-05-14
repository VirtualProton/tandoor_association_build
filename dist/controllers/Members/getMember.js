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
exports.getApprovalPendingMember = exports.getCancelledMember = exports.getInactiveMember = exports.getActiveMember = exports.getExecutiveMember = exports.getValidMember = exports.getAllMember = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getAllMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    partnerDetails: true,
                    similarMembershipInquiry: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getAllMember = getAllMember;
const getValidMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                where: {
                    similarMembershipInquiry: {
                        is_valid_member: "TRUE",
                    },
                },
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    similarMembershipInquiry: true,
                    partnerDetails: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getValidMember = getValidMember;
const getExecutiveMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                where: {
                    similarMembershipInquiry: {
                        is_executive_member: "TRUE",
                    },
                },
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    partnerDetails: true,
                    similarMembershipInquiry: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getExecutiveMember = getExecutiveMember;
const getActiveMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                where: {
                    membershipStatus: "ACTIVE",
                },
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    partnerDetails: true,
                    similarMembershipInquiry: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getActiveMember = getActiveMember;
const getInactiveMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                where: {
                    membershipStatus: "INACTIVE",
                },
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    partnerDetails: true,
                    similarMembershipInquiry: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getInactiveMember = getInactiveMember;
const getCancelledMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                where: {
                    membershipStatus: "CANCELLED",
                },
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    partnerDetails: true,
                    similarMembershipInquiry: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getCancelledMember = getCancelledMember;
const getApprovalPendingMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const members = yield __1.prismaClient.members.findMany({
                where: {
                    approvalStatus: "PENDING",
                },
                include: {
                    machineryInformations: true,
                    branches: { include: { machineryInformations: true } },
                    complianceDetails: true,
                    partnerDetails: true,
                    similarMembershipInquiry: true,
                    attachments: true,
                    proposer: true,
                    executiveProposer: true,
                    declarations: true,
                },
            });
            console;
            res.json(members);
        }
        else {
            next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException(e.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getApprovalPendingMember = getApprovalPendingMember;
