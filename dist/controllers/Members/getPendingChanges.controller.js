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
exports.getMemberChanges = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getMemberChanges = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { approvalStatus } = req.params;
        const statusStr = approvalStatus === null || approvalStatus === void 0 ? void 0 : approvalStatus.toUpperCase();
        console.log("statusStr", statusStr);
        if (!req.user) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!["APPROVED", "DECLINED", "PENDING", "ALL"].includes(statusStr)) {
            return next(new bad_request_1.BadRequestsException("Invalid approval status", root_1.ErrorCode.INVALID_INPUT));
        }
        if (statusStr === "ALL") {
            const allChanges = yield __1.prismaClient.membersPendingChanges.findMany({
                include: {
                    approvedByAdmin: true,
                    modifiedByEditor: true,
                },
                orderBy: {
                    modifiedAt: 'desc',
                },
            });
            return res.json(allChanges);
        }
        else {
            const allChanges = yield __1.prismaClient.membersPendingChanges.findMany({
                where: {
                    approvalStatus: statusStr,
                },
                include: {
                    member: true,
                    approvedByAdmin: true,
                    modifiedByEditor: true,
                },
                orderBy: {
                    modifiedAt: 'desc',
                },
            });
            return res.json(allChanges);
        }
    }
    catch (err) {
        console.error('Error fetching filtered changes:', err);
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getMemberChanges = getMemberChanges;
