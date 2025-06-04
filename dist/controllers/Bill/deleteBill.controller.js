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
exports.deleteBill = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const deleteBill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { billingId } = req.params;
        if (req.user.role === "ADMIN") {
            yield __1.prismaClient.memberBillingHistory.delete({
                where: {
                    billingId
                }
            });
            return res.json({
                message: `Bill ${billingId} deleted successfully`
            });
        }
        return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
    }
    catch (err) {
        if (err.code === "P2025") {
            // Prisma error code for record not found
            return next(new bad_request_1.BadRequestsException("Bill not found", root_1.ErrorCode.NOT_FOUND));
        }
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.deleteBill = deleteBill;
