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
exports.deleteMembers = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const deleteMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const membershipIds = req.body.membershipIds;
        if (!["ADMIN"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!membershipIds || membershipIds.length === 0) {
            return next(new bad_request_1.BadRequestsException("Membership IDs are required", root_1.ErrorCode.BAD_REQUEST));
        }
        const deleteMembers = yield __1.prismaClient.members.deleteMany({
            where: {
                membershipId: {
                    in: membershipIds,
                },
            },
        });
        res.json({
            message: "Members deleted successfully",
            deletedCount: deleteMembers.count,
        });
    }
    catch (e) {
        return next(new bad_request_1.BadRequestsException("Failed to delete members", root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.deleteMembers = deleteMembers;
