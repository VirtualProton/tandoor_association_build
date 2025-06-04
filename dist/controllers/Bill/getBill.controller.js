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
exports.getBill = void 0;
const __1 = require("../..");
const bad_request_1 = require("../../exceptions/bad-request");
const root_1 = require("../../exceptions/root");
const getBill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { paymentStatus } = req.params;
        paymentStatus = paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.toUpperCase();
        if (!["ADMIN", "ADMIN_VIEWER", "TSMWA_EDITOR", "TSMWA_VIEWER", "TQMA_EDITOR", "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!["ALL", "DUE", "PARTIAL", "PAID"].includes(paymentStatus)) {
            return next(new bad_request_1.BadRequestsException("Invalid payment status", root_1.ErrorCode.BAD_REQUEST));
        }
        if (paymentStatus === "ALL") {
            const AllBill = yield __1.prismaClient.memberBillingHistory.findMany();
            return res.status(200).json(AllBill);
        }
        else {
            const AllBill = yield __1.prismaClient.memberBillingHistory.findMany({
                where: {
                    paymentStatus: paymentStatus // Replace 'any' with the actual enum type if imported, e.g., as PaymentStatusEnum
                }
            });
            return res.status(200).json(AllBill);
        }
    }
    catch (err) {
        return new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST);
    }
});
exports.getBill = getBill;
