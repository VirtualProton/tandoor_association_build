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
exports.approveOrDeclineMember = void 0;
const __1 = require("../..");
const root_1 = require("../../exceptions/root");
const bad_request_1 = require("../../exceptions/bad-request");
const approveOrDeclineMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { membershipId, action, declineReason } = req.body;
    try {
        if (req.user.role !== "ADMIN") {
            throw new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED);
        }
        const member = yield __1.prismaClient.members.findUnique({
            where: {
                membershipId,
            },
        });
        if (!member) {
            throw new bad_request_1.BadRequestsException("Member not found", root_1.ErrorCode.NOT_FOUND);
        }
        if (!["APPROVED", "DECLINED"].includes(action)) {
            throw new bad_request_1.BadRequestsException("Invalid action", root_1.ErrorCode.INVALID_INPUT);
        }
        if (action === "APPROVED") {
            yield __1.prismaClient.members.update({
                where: {
                    membershipId,
                },
                data: {
                    approvalStatus: "APPROVED",
                    isPaymentDue: "FALSE",
                    approvedOrDeclinedAt: new Date(),
                    nextDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    approvedOrDeclinedBy: req.user.userId,
                },
            });
        }
        if (action === "DECLINED") {
            yield __1.prismaClient.members.update({
                where: {
                    membershipId,
                },
                data: {
                    approvalStatus: "DECLINED",
                    isPaymentDue: "FALSE",
                    approvedOrDeclinedBy: req.user.userId,
                    declineReason: declineReason || null,
                },
            });
        }
    }
    catch (error) {
        // console.error(error);
        next(new bad_request_1.BadRequestsException(error.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.approveOrDeclineMember = approveOrDeclineMember;
