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
exports.getBillSummary = exports.getFilteredBills = exports.getBillById = exports.getBill = void 0;
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
const getBillById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { billingId } = req.params;
        if (!["ADMIN", "ADMIN_VIEWER", "TSMWA_EDITOR", "TSMWA_VIEWER", "TQMA_EDITOR", "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!billingId) {
            return next(new bad_request_1.BadRequestsException("Billing ID is required", root_1.ErrorCode.BAD_REQUEST));
        }
        else {
            const bill = yield __1.prismaClient.memberBillingHistory.findUnique({
                where: {
                    billingId
                }
            });
            if (!bill) {
                return next(new bad_request_1.BadRequestsException("Bill not found", root_1.ErrorCode.NOT_FOUND));
            }
            return res.status(200).json(bill);
        }
    }
    catch (err) {
        return new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST);
    }
});
exports.getBillById = getBillById;
const getFilteredBills = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { billingId, membershipId, paymentStatus } = req.params;
        billingId = billingId === "null" ? undefined : billingId;
        membershipId = membershipId === "null" ? undefined : membershipId;
        paymentStatus = paymentStatus === "null" ? undefined : paymentStatus;
        paymentStatus = typeof paymentStatus === "string" ? paymentStatus.toUpperCase() : undefined;
        if (!["ADMIN", "ADMIN_VIEWER", "TSMWA_EDITOR", "TSMWA_VIEWER", "TQMA_EDITOR", "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        if (!billingId && !membershipId && !paymentStatus) {
            const allBills = yield __1.prismaClient.memberBillingHistory.findMany();
            return res.status(200).json(allBills);
        }
        if (paymentStatus && !["ALL", "DUE", "PARTIAL", "PAID"].includes(paymentStatus)) {
            return next(new bad_request_1.BadRequestsException("Invalid payment status", root_1.ErrorCode.BAD_REQUEST));
        }
        // Build dynamic where clause
        const whereClause = {};
        if (billingId) {
            whereClause.billingId = billingId;
        }
        if (membershipId) {
            whereClause.membershipId = membershipId;
        }
        if (paymentStatus && paymentStatus !== "ALL") {
            whereClause.paymentStatus = paymentStatus;
        }
        const bills = yield __1.prismaClient.memberBillingHistory.findMany({
            where: whereClause
        });
        if (!bills || bills.length === 0) {
            return next(new bad_request_1.BadRequestsException("Bill(s) not found", root_1.ErrorCode.NOT_FOUND));
        }
        return res.status(200).json(bills.length === 1 ? bills[0] : bills);
    }
    catch (err) {
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getFilteredBills = getFilteredBills;
const getBillSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!["ADMIN", "ADMIN_VIEWER", "TSMWA_EDITOR", "TSMWA_VIEWER", "TQMA_EDITOR", "TQMA_VIEWER"].includes(req.user.role)) {
            return next(new bad_request_1.BadRequestsException("Unauthorized", root_1.ErrorCode.UNAUTHORIZED));
        }
        const totalAmountResult = yield __1.prismaClient.memberBillingHistory.aggregate({
            _sum: {
                totalAmount: true
            }
        });
        const totalAmount = totalAmountResult._sum.totalAmount || 0;
        const totalRecords = yield __1.prismaClient.memberBillingHistory.count();
        const [totalPaidAmountResult, totalPaidCount] = yield Promise.all([
            __1.prismaClient.memberBillingHistory.aggregate({
                _sum: {
                    paidAmount: true
                },
                where: {
                    paymentStatus: {
                        in: ["PAID", "PARTIAL"]
                    }
                }
            }),
            __1.prismaClient.memberBillingHistory.count({
                where: {
                    paymentStatus: {
                        in: ["PAID", "PARTIAL"]
                    }
                }
            })
        ]);
        const totalPaidAmount = totalPaidAmountResult._sum.paidAmount || 0;
        const [totalDueAmountResult, totalDueCount] = yield Promise.all([
            __1.prismaClient.memberBillingHistory.aggregate({
                _sum: {
                    dueAmount: true
                },
                where: {
                    paymentStatus: {
                        in: ["DUE", "PARTIAL"]
                    }
                }
            }),
            __1.prismaClient.memberBillingHistory.count({
                where: {
                    paymentStatus: {
                        in: ["DUE", "PARTIAL"]
                    }
                }
            })
        ]);
        const totalDueAmount = totalDueAmountResult._sum.dueAmount || 0;
        return res.status(200).json({
            message: "Bill summary fetched successfully",
            data: {
                totalRecords,
                totalAmount,
                totalPaidCount,
                totalPaidAmount,
                totalDueCount,
                totalDueAmount,
            }
        });
    }
    catch (err) {
        console.error(err);
        return next(new bad_request_1.BadRequestsException(err.message, root_1.ErrorCode.BAD_REQUEST));
    }
});
exports.getBillSummary = getBillSummary;
